'use strict';

const Action = require('./Action');
const { Events } = require('../../util/Constants');
const SnowflakeUtil = require('../../util/Snowflake');

const parseContent = options => {
  let content = '';
  options.forEach(element => (content += element.value));
  return content;
};

class InteractionCreateAction extends Action {
  async handle(data) {
    const client = this.client;
    const guild = client.guilds.cache.get(data.guild_id);
    const authorid = guild ? data.member.user.id : data.user.id;
    const interaction = {
      id: data.id,
      channel: client.channels.cache.get(data.channel_id),
      guild: guild,
      token: data.token,
      member: guild ? guild.members.cache.get(data.member.user.id) || (await guild.members.fetch(data.member.user.id)) || null : null,
      author: client.users.cache.get(authorid) || (await client.users.fetch(authorid)) || null,
      name: data.data.name,
      content: data.data.options ? parseContent(data.data.options) : "",
      createdTimestamp: SnowflakeUtil.deconstruct(data.id).timestamp,
      options: data.data.options ? data.data.options : null,
    };
    client.emit(Events.INTERACTION_CREATE, interaction);
    return { interaction };
  }
}

module.exports = InteractionCreateAction;
