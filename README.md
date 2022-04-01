# Discord Help-Command Creator

**ONLY WORKS IN THE SAPPHIRE FRAMEWORK!!**

Typescript example:

1. Create a help command file.
1. Add some boilerplate:

```ts
import { ApplyOptions } from '@sapphire/decorators';
import {
  ApplicationCommandRegistry,
  Command,
  CommandOptions,
  RegisterBehavior,
} from '@sapphire/framework';
import type { CommandInteraction, EmbedField } from 'discord.js';
import {
  PaginatedMessage,
  type PaginatedMessagePage,
} from '@sapphire/discord.js-utilities';
import { createHelpCommand } from 'discord-help-command-creator';

@ApplyOptions<CommandOptions>({
  requiredClientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
})
export class UserCommand extends Command {
  public async messageRun(message: Message) {
    createHelpCommand(this.store.get('commands'), message);
  }
}
```
