import { Message } from "discord.js";
import { AppConfig } from "../../../../config/env";
import { OnMessageReceiveActionCreator } from "../../../../shared/interfaces";

export class GetHelp implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    const replyMessage = this.getReplyMessage();
    await message.reply(replyMessage);
    return;
  }

  getReplyMessage() {
    const prefix = AppConfig.commands.prefix;
    const commands = AppConfig.commands;

    const useFull = `Todos os comandos devem começar com o prefixo: ${prefix}`;

    const lolRank = `${commands.lolRank} => Mostra o rank atual dos jogadores cadastrados`;
    const listSummoner = `${commands.listSummoner} => Mostra a lista dos jogadores cadastrados no rank`;
    const addSummoner = `${commands.addSummoner} + nick no lol => Adiciona um jogador no rank (O nome do invocador nao pode conter ${prefix})`;
    const deleteSummoner = `${commands.deleteSummoner} + name => Remove um jogador do rank`;

    const playMusic = `${commands.playMusic} + Nome da musica ou link no youtube => Toca a musica especificada, se ja houver uma musica tocando ela é adicionada a fila`;
    const nextMusic = `${commands.skipMusic} => Passa para a proxima musica da fila`;
    const stopMusic = `${commands.stopMusic} => Para a musica e desconecta o bot do canal de voz`;
    const getQueueSong = `${commands.getQueueSongs} => Mostra todos os sons que estão na fila`;

    const messageArray = [
      useFull,
      lolRank,
      listSummoner,
      addSummoner,
      deleteSummoner,
      playMusic,
      nextMusic,
      stopMusic,
      getQueueSong,
    ];

    return messageArray.join("\n");
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }
}
