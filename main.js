const electron = require('electron');
const url      = require('url');
const path     = require('path');
const locals = {};
const pug = require('electron-pug')({pretty:true}, locals);
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;


// Listen for app to be ready
app.on('ready', () =>{
    //Create Window
    mainWindow = new BrowserWindow({});

    /*// load html for loading animation
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loading-animation.pug'),
        protocol: 'file:',
        slashes: true
    }));

    // load room data
    let ipData = loadHmsData();
    mainWindow.webContents.send('data:ipdata', data);*/

    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.pug'),
        protocol: 'file:',
        slashes : true
    }));

    // quit app when closed
    mainWindow.on('closed', ()=>{
        app.quit();
    });

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);

});


app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

//Catch item:add
ipcMain.on('item:add', (e, item)=>{
    mainWindow.webContents.send('item:add', item);
});

//create menu template
const mainMenuTemplate = [
    {
        label  : 'File',
        submenu: [
            {
                label: 'add item'
            },
            {
                label: 'clear items'
            },
            {
                label      : 'quit',
                accelerator: shortcut('Ctrl+Q'),
                click(){
                    app.quit();
                }
            },

        ]
    }
];

// if Mac, add empty object to menu

if(process.platform === 'darwin'){
    mainMenuTemplate.unshift({});
}

// add dev tools item if not in prod
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label  : 'Developer Tools',
        submenu: [
            {
                label      : 'toggle DevTools',
                accelerator: shortcut('Ctrl+I'),
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}

function shortcut(shortcut){
    return process.platform === 'darwin' ? shortcut.replace('Ctrl', 'Command') : shortcut
}

function loadHmsData(){
    let rawData = require('homs-data.json');
    let list = [];
    for(house in rawData.houses){
        for(room in house.rooms){
            let startip = "";
            let stopip = "";
            list.append({
                house: house.house,
                room: room.room,
                ip: {
                    start: startip,
                    stop: stopip
                }
            })
        }
    }
}
