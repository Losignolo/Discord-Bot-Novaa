const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`NovaBot è online come ${client.user.tag}`);
});

// Comandi slash
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Risponde con Pong!'),

    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Cancella messaggi')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Numero di messaggi da cancellare')
                .setRequired(true)
        )
].map(cmd => cmd.toJSON());

// Registrazione comandi
const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );
        console.log('Comandi registrati!');
    } catch (error) {
        console.error(error);
    }
})();

// Risposte ai comandi
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'clear') {
        const amount = interaction.options.getInteger('amount');
        await interaction.channel.bulkDelete(amount);
        await interaction.reply(`Ho cancellato ${amount} messaggi.`);
    }
});

client.login(config.token);
