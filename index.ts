import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command, CommandStore } from '@sapphire/framework';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import ms from 'ms';

export interface HelpCommandOptions {
  /**
   * If you want a custom first page upon first using the help command, you can set this.
   */
  firstPage?: MessageEmbed;
  /**
   * If a user who didn't start the command tried to use an interaction, this message will be sent.
   */
  wrongUserMessage?: string;
}

export interface HelpPages {
  [category: string]: Command[];
}

/**
 * Creates a help command
 * @param data The CommandStore instance to build the pages. Can be accessed through `this.stores.get('commands')`.
 * @param replyTo The message or interaction to reply to when sending the help command.
 * @param options
 */
export function createHelpCommand(
  data: CommandStore,
  replyTo: CommandInteraction | Message,
  options: HelpCommandOptions = {}
) {
  const pages: HelpPages = {};
  // create a paginated message instance
  const pager = new PaginatedMessage();
  // set the first page
  options.firstPage && pager.addPageEmbed(options.firstPage);
  data.forEach((cmd) => {
    pages[cmd.category ?? 'No Category']
      ? pages[cmd.category ?? 'No Category'].push(cmd)
      : (pages[cmd.category ?? 'No Category'] = [cmd]);
  });
  const categories = Object.keys(pages);
  categories.forEach((cat) => {
    const commands = pages[cat];
    pager.addPageEmbed((b) =>
      b.setTitle(cat).addFields(
        commands.map((cmd) => ({
          name: cmd.enabled ? cmd.name : `~~${cmd.name}~~ (disabled)`,
          value: `${
            cmd.description
              ? '**Description: **' + cmd.description
              : cmd.detailedDescription
              ? '**Description: **' + cmd.detailedDescription
              : ''
          }
${
  cmd.aliases
    ? '**Aliases: **' + cmd.aliases.map((alias) => `\`${alias}\``)
    : ''
}
${
  typeof cmd.options.options === 'string'
    ? '**Options: **' + cmd.options.options
    : cmd.options.options === true
    ? '**Options: **' + 'any'
    : ''
}
${
  cmd.options.cooldownDelay
    ? `**Cooldown: **${ms(cmd.options.cooldownDelay)}`
    : ''
}`,
          inline: true,
        }))
      )
    );
  });
  pager.setWrongUserInteractionReply((i) => ({
    ephemeral: true,
    content: options.wrongUserMessage ?? "This isn't your command.",
  }));

  pager.run(replyTo);
}
