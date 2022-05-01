const { LexRuntimeServiceClient, PostTextCommand, PostTextCommandInput } = require('@aws-sdk/client-lex-runtime-service');
const lexClient = new LexRuntimeServiceClient({
  region: 'us-east-1',
});

const blackjackExp = new RegExp(/(blackjack|black-jack)/i);
const rouletteExp = new RegExp(/(roulette|ruleta)/i);
const crashExp = new RegExp(/crash/i);

class ChatbotController {
  static async postMessage(req, res) {
    const sessionId = req.session.id;
    /** @type { PostTextCommandInput } */
    const params = {
      botAlias: 'TuksbetBot',
      botName: 'TuksBot',
      inputText: req.body.text,
      userId: sessionId,
    };
    const command = new PostTextCommand(params);
    const response = await lexClient.send(command);

    if (
      response.intentName &&
      response.intentName === 'InfoAboutCripto' &&
      response.dialogState &&
      response.dialogState === 'Fulfilled'
    ) {
      response.message = `TuksBet se encuentra en constante evolución para darte la mejor experiencia de casino 
                          en línea, es por eso que los depósitos con Criptomonedas se encontrarán disponibles muy 
                          pronto.`;
      console.log('Info about crypto');
    } else if (
      response.intentName &&
      response.intentName === 'LearnAboutDeposits' &&
      response.dialogState &&
      response.dialogState === 'Fulfilled'
    ) {
      response.message = `Se pueden realizar depósitos de manera rápida y sencilla ingresando a la sección de 
                          "Balance". Para acceder a esta sección basta con tener la sesión iniciada y hacer click 
                          en la cartera que aparece al centro de la parte superior de la ventana. Después de eso 
                          se selecciona el monto a depositar y se usan las credenciales necesarias para realizar el 
                          depósito.\n
                          Por lo pronto TuksBet solo permite depósitos vía PayPal.`;
      console.log('Info about deposits');
    } else if (
      response.intentName &&
      response.intentName === 'LearnToBet' &&
      response.dialogState &&
      response.dialogState === 'Fulfilled'
    ) {
      response.message = `Para poder realizar una apuesta, cada juego cuenta con un campo específico. Este campo se 
                          encuentra en la parte inferior de la pantalla y contiene botones para generar la apuesta. 
                          Solo es necesario ingresar una cantidad y presionar el botón de "Apostar".\n
                          Los juegos como Crash y Roulete bloquean las apuestas cuando comienza una nueva ronda y 
                          solo se permite realizar apuestas cuando están esperando el inicio de una nueva ronda`;
      console.log('Info about bets');
    } else if (
      response.intentName &&
      response.intentName === 'LearnToChangePasswords' &&
      response.dialogState &&
      response.dialogState === 'Fulfilled'
    ) {
      response.message = `Para cambiar la contraseña de tu cuenta es necesario que hayas iniciado sesión usando tu 
                          nombre de usuario y contraseña, de otra manera realizar este cambio no será posible.\n
                          El cambio de contraseña se puede realizar haciendo click en el botón "Mi perfil" que se 
                          encuentra en la parte superior derecha de la pantalla, ahí encontrarás una sección para 
                          cambiar la contraseña.`;
      console.log('Info about password changes');
    } else if (
      response.intentName &&
      response.intentName === 'LearnToEditProfile' &&
      response.dialogState &&
      response.dialogState === 'Fulfilled'
    ) {
      response.message = `Para editar los datos de tu cuenta, deberás acceder a "Mi perfil". Aquí podrás 
                          encontrar las secciones necesarias para editar datos como nombre de usuario o foto de 
                          perfil.`;
      console.log('Info about profile updates');
    } else if (
      response.intentName &&
      response.intentName === 'LearnToPlay' &&
      response.dialogState &&
      response.dialogState === 'Fulfilled'
    ) {
      console.log('Info about games');
      if (blackjackExp.test(response.slots.Juego)) {
        response.message = `Este es el único juego de TuksBet que se juega de manera individual, sigue las reglas 
                            del juego clásico donde se reparten dos cartas a cada participante, en este caso a la 
                            computadora y al jugador. Dependiendo de las cartas obtenidas, cada jugador podrá 
                            pedir más cartas para lograr que la suma de sus valores sea lo más cercana a 21. Si esta 
                            suma es mayor a 21, el jugador pierde automáticamente; si la suma es menor a 21, gana el 
                            jugador que tiene la suma más alta.`;
        console.log('crash info');
      } else if (rouletteExp.test(response.slots.Juego)) {
        response.message = `Este juego consiste en la clasica Ruleta donde los jugadores podrán apostar al color 
                            verde, rojo o negro. Una nueva ronda inicia 15 segundos después de que la ronda anterior 
                            haya finalizado.`;
        console.log('roulette info');
      } else if (crashExp.test(response.slots.Juego)) {
        response.message = `Crash consiste en salir del juego antes de que el multiplicador incremental llegue a su 
                            tope. Este tope es aleatorio para cada ronda y dependiendo de si el jugador se salió antes 
                            de que el juego llegara a ese multiplicador, gana, o si no se salió, pierde, y se paga 
                            de acuerdo con el multiplicador en el jugador se salió.`;
        console.log('crash info');
      }
    }
    res.send({
      resp: response.message,
    });
  }
}
module.exports = ChatbotController;
