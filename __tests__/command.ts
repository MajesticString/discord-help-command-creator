import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { createHelpCommand } from '..';

export class UserCommand extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      description: 'help command what else',
    });
  }
  public async messageRun(interaction: Message) {
    createHelpCommand(this.container.stores.get('commands'), interaction);
  }
}
