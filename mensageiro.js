const apresentaData = (dataEnvio) => {
    const date = new Date(dataEnvio);

    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate} às ${formattedTime}`;
}

//** Aqui você solta o alerta do no coletor  */
const apresentaAlerta = ({ Texto, DataEnvio }) => {
    alert(`${apresentaData(DataEnvio)} - ${Texto}`)
}

const rabbitStart = () => {
    const url = "ws://10.10.0.14:15674/ws";

    const client = new StompJs.Client({
        brokerURL: url,
        connectHeaders: {
            login: "dev_induscabos",
            passcode: "Ind_4682"
        },
        reconnectDelay: 5000,
    });

    client.onConnect = (frame) => {
        console.log("Conectado ao RabbitMQ");

        client.subscribe("/exchange/mensageiro", (message) => {
            if (message.body) {
                try {
                    apresentaAlerta(JSON.parse(message.body));
                } catch (error) {
                    apresentaAlerta({ Texto: message.body, DataEnvio: new Date() });
                }
            }
        });
    };

    client.onStompError = (frame) => {
        console.error("Erro STOMP", frame);
    };

    client.activate();
}

rabbitStart()