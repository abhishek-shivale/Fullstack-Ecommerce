import chalk from 'chalk'

function SuccessMsg(log){
    console.log(chalk.greenBright.bold(log))
}
function ErrorMsg(log){
    console.error(chalk.redBright.bold(log))
}
export {SuccessMsg, ErrorMsg}