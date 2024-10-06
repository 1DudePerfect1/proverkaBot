const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters')
require('dotenv').config()


const bot = new Telegraf(process.env.BOT_TOKEN)
const subs = {}

const text = require('./const')

const adminsId3 = [
    {id: 606024467, name: "Ильдар"},
    {id:1385003429, name: "Данил"}
]
const adminMarkup = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Проверка", callback_data: "proverka"}
            ]
        ]
    }
}
const userMarkup = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Авторизоваться", callback_data: "login"}
            ]
        ]
    }
}

bot.use((ctx, next) => {
    if (adminsId3.some(el => {
        el.id === ctx.from.id
    })){
        ctx.isAdmin = true
    }else ctx.isAdmin = false
    next() 
})

bot.start(async (ctx)=>{
    try {
        if(ctx.isAdmin){
            await ctx.reply(`Добро пожаловать господин-админ ${ctx.from.first_name}`, adminMarkup)
        }else await ctx.reply(`Привет ${ctx.from.first_name}`, userMarkup)
    } catch (error) {
        console.error(error)
    }
})

bot.action('login', async(ctx) => {
    try {
        await ctx.answerCbQuery()
        const userId= ctx.from.id
        if (subs[userId]){
            ctx.reply("Ты уже у нас есть чорт")
        }else {
            subs[userId] = ctx.from.first_name
            ctx.replyWithHTML(`Теперь ты готов, <a href = "https://i.imgflip.com/3rhnjg.jpg">${ctx.from.first_name}</a>. Жди уведомлений о проверкe.`,
            {disable_web_page_preview: true})
            console.log("Добавлен пользователь: ", subs[userId], userId)
        }
        
    } catch (error) {
        console.log(error)
    }
    
})

bot.action('proverka', async (ctx) =>{
    try {
        await ctx.answerCbQuery()
        if(ctx.isAdmin){
            Object.keys(subs).forEach((subId)=> {
                if(ctx.from.id !== subId){
                    ctx.reply( "Проверка! Закрывай дверь, прячь посуду")
                }else ctx.reply("Отправлено")       
            })
        }else {
            ctx.reply('Вы не подписаны на уведомления. Используйте "Авторизоваться", чтобы подписаться')
        }
    } catch (error) {
        console.log(error)
    }
    
})

bot.help((ctx)=> {
    ctx.reply(text.commands)
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))