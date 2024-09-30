document.addEventListener("DOMContentLoaded", function () {
  // Seleciona os elementos do modal e botões de ação
  const modal = document.getElementById("modal");
  const openModal = document.getElementById("open-modal");
  const closeModal = document.getElementsByClassName("close")[0];
  const addTaskButton = document.getElementById("adicionar-tarefa");
  // const taskList = document.getElementById("lista-tarefas");

  // Lista para exibir os eventos agendados
  const listaEventos = document.getElementById("lista-eventos");

  // Listas de tarefas (colunas)
  const listas = {
    pendentes: document.getElementById("tarefas-pendentes"),
    andamento: document.getElementById("tarefas-andamento"),
    progresso: document.getElementById("tarefas-progresso"),
    concluidas: document.getElementById("tarefas-concluidas"),
  };

  let audio = null; // Variável global para armazenar o objeto de áudio

  // Função para tocar um som de alarme
  function tocarAlarme() {
    audio = new Audio("assets/sounds/kirby-alarm-clock-127079.mp3");
    audio.play();
  }

  // Função para pausar o som do alarme
  function pausarAlarme() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; //Reinicia o áudio para o ínico
    }
  }

  // Função para agendar um alarme
  function agendarAlarme(tarefa, horaAlarme) {
    const agora = new Date();
    const alarme = new Date(agora.toDateString() + " " + horaAlarme);

    // Calcula o tempo restante até o alarme
    const tempoRestante = alarme.getTime() - agora.getTime();

    // Se o alarme estiver no futuro, agende
    if (tempoRestante > 0) {
      setTimeout(() => {
        tocarAlarme(); // Toca o som quando o alarme dispara
        alert(`Alarme: ${tarefa}`);
      }, tempoRestante);
    } else {
      alert("A hora do alarme deve ser no futuro.");
    }
  }

  // Mapeia a ordem das colunas
  const colunasOrdem = ["pendentes", "andamento", "progresso", "concluidas"];

  // Função para definir a cor da tarefa com base na lista ***Melhorias do Cód feita por André Abrantes***
  function definirCor(taskItem, listaAtual) {
    switch (listaAtual) {
      case "pendentes":
        taskItem.style.backgroundColor = "blue";
        break;
      case "andamento":
        taskItem.style.backgroundColor = "orange";
        break;
      case "progresso":
        taskItem.style.backgroundColor = "purple";
        break;
      case "concluidas":
        taskItem.style.backgroundColor = "green";
        break;
    }
  }

  // Variável para armazenar o elemento arrastado
  let draggingElement = null;

  // Função para abrir o modal de adicionar tarefa
  openModal.onclick = function () {
    modal.style.display = "block";
  };

  // Função para fechar o modal
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  // Fecha o modal clicando fora dele
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Função para adicionar uma nova tarefa
  addTaskButton.addEventListener("click", function () {
    const taskInput = document.getElementById("nova-tarefa").value;
    const horaAlarme = document.getElementById("hora-alarme").value;
    const dataEvento = document.getElementById("data-entrega").value;

    // Verifica se o campo de tarefa ou alarme está vazio
    if (taskInput === "" || horaAlarme === "") {
      return alert(
        "Por favor, insira uma tarefa e defina uma hora para o alarme."
      );
    }

    // // Verifica se o campo de tarefa está vazio
    // if (taskInput === "") return alert("Por favor, insira uma tarefa.");

    // Cria um novo item de tarefa (li)
    const taskItem = document.createElement("li");
    taskItem.textContent = `${taskInput} - Data do Evento: ${dataEvento} - Hora do Alarme: ${horaAlarme}`;
    // taskItem.textContent = taskInput;
    taskItem.setAttribute("draggable", true); // Permite que o item seja arrastável

    // Adiciona o evento agendado na lista de eventos
    const eventoItem = document.createElement("li");
    eventoItem.textContent = `${taskInput} - Alarme para: ${horaAlarme}`;
    listaEventos.appendChild(eventoItem);

    // Cria o botão de pausar alarme
    const pauseButton = document.createElement("button");
    pauseButton.classList.add("remover-tarefa");
    pauseButton.textContent = "Pausar Alarme";
    pauseButton.addEventListener("click", function () {
      pausarAlarme(); // Pausa o som do alarme quando o botão é clicado
    });
    eventoItem.appendChild(pauseButton);

    listaEventos.appendChild(eventoItem);

    // Referência cruzada entre o item da tarefa e o item da lista
    taskItem.eventoItem = eventoItem;
    eventoItem.taskItem = taskItem;

    // Criar um contêiner para os botões de ação (navegar e remover)
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    // Função para encontrar a lista atual da tarefa
    function encontrarListaAtual() {
      return Object.keys(listas).find((lista) =>
        listas[lista].contains(taskItem)
      );
    }

    // Botão de navegação anterior ***Melhorias do Cód feita por André Abrantes implementada a lógica do button***
    const previousButton = document.createElement("button");
    previousButton.classList.add("nav-button");
    previousButton.textContent = "<";
    previousButton.addEventListener("click", function () {
      const listaAtual = encontrarListaAtual();
      const indexAtual = colunasOrdem.indexOf(listaAtual);
      if (indexAtual > 0) {
        const listaAnterior = listas[colunasOrdem[indexAtual - 1]];
        listaAnterior.appendChild(taskItem);
        definirCor(taskItem, colunasOrdem[indexAtual - 1]);
      }
    });

    // Botão de navegação próximo ***Melhorias do Cód feita por André Abrantes implementada a lógica do button***
    const nextButton = document.createElement("button");
    nextButton.classList.add("nav-button");
    nextButton.textContent = ">";
    nextButton.addEventListener("click", function () {
      const listaAtual = encontrarListaAtual();
      const indexAtual = colunasOrdem.indexOf(listaAtual);

      if (indexAtual < colunasOrdem.length - 1) {
        const listaProxima = listas[colunasOrdem[indexAtual + 1]];
        listaProxima.appendChild(taskItem); // Move a tarefa para a próxima coluna
        definirCor(taskItem, colunasOrdem[indexAtual + 1]);
      }
    });

    // Botão de remover tarefa
    const removeButton = document.createElement("button");
    removeButton.classList.add("remover-tarefa");
    removeButton.textContent = "Remover";

    // Função para remover a tarefa da lista
    removeButton.onclick = function () {
      taskItem.remove(); // Remove o item da lista
      eventoItem.remove(); //Remove o item correspondente
    };

    // Adiciona os botões ao contêiner de ações
    actionsDiv.appendChild(previousButton);
    actionsDiv.appendChild(nextButton);
    actionsDiv.appendChild(removeButton);
    taskItem.appendChild(actionsDiv);



    // Adiciona a nova tarefa à lista de tarefas
    listas.pendentes.appendChild(taskItem);

    // Agende o alarme
    agendarAlarme(taskInput, horaAlarme);

    // Exibe uma mensagem de confirmação de que a tarefa foi adicionada
    alert("Tarefa adicionada com sucesso!");

    // Limpa o campo de input após adicionar a tarefa
    document.getElementById("nova-tarefa").value = "";
    document.getElementById("hora-alarme").value = "";
    document.getElementById("data-entrega").value = "";

    // Fecha o modal após adicionar a tarefa
    modal.style.display = "none";

    // Funções de arrastar e soltar para a nova tarefa adicionada
    taskItem.addEventListener("dragstart", function (e) {
      draggingElement = taskItem; // Armazena o item que está sendo arrastado
      setTimeout(function () {
        taskItem.style.display = "none"; // Oculta temporariamente o item para facilitar a visualização ao arrastar
      }, 0);
    });

    taskItem.addEventListener("dragend", function (e) {
      setTimeout(function () {
        draggingElement.style.display = "flex"; // Volta a exibir o item após soltar
        draggingElement = null; // Reseta o item arrastado
      }, 0);
    });

    // Configura as listas para receber os itens arrastados
    document.querySelectorAll(".lista").forEach(function (list) {
      list.addEventListener("dragover", function (e) {
        e.preventDefault(); // Previne o comportamento padrão para permitir o drop
      });

      list.addEventListener("drop", function (e) {
        if (draggingElement) {
          list.appendChild(draggingElement); // Move o item arrastado para a nova lista
          definirCor(draggingElement, listaAtual); // Define a cor da tarefa
        }
      });
    });
  });

  // Configura as funções de arrastar e soltar para as listas de tarefas existentes
  document.querySelectorAll("li").forEach(function (taskItem) {
    taskItem.addEventListener("dragstart", function (e) {
      draggingElement = taskItem; // Armazena o item arrastado
      setTimeout(function () {
        taskItem.style.display = "none"; // Oculta o item temporariamente ao arrastar
      }, 0);
    });

    taskItem.addEventListener("dragend", function (e) {
      setTimeout(function () {
        draggingElement.style.display = "flex"; // Exibe o item após o arraste
        draggingElement = null; // Reseta a referência ao item arrastado
      }, 0);
    });
  });

  // Adiciona a capacidade de drop para todas as listas
  document.querySelectorAll(".lista").forEach(function (list) {
    list.addEventListener("dragover", function (e) {
      e.preventDefault(); // Previne o comportamento padrão para permitir o drop
    });

    list.addEventListener("drop", function (e) {
      if (draggingElement) {
        const listaAtual = Object.keys(listas).find(
          (key) => listas[key] === list
        ); // Encontra a lista correta com base no elemento DOM
        list.appendChild(draggingElement); // Solta o item arrastado na nova lista
        definirCor(draggingElement, listaAtual); // Define a cor da tarefa
      }
    });
  });
});
