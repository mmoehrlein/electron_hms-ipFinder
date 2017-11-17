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

    // load room data
    let ipData = loadHmsData();
    mainWindow.webContents.send('data:ipdata', ipData);

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
    let rawData = require('./hms-data.json');
    let list = [];
    let startip = "000.000.000.000";
    let lastip = "000.000.000.000";
    console.log("for1");
    for(let i = 0; i < rawData.houses.length; i++){
        let house = rawData.houses[i];
        console.log("for2");
        console.log(house.rooms);
        for(let j = 0; j < house.rooms.length; j++){
            let room = house.rooms[j];
            console.log(room);
            console.log("for3");
            if(typeof room.ipStart == 'undefined'){
                let iparray = startip.split('.');
                iparray[3] = (parseInt(iparray[3]) + 8).toString();
                startip = iparray.join('.');

                iparray[3] = (parseInt(iparray[3]) + 7).toString();
                lastip = iparray.join('.');
            }else{
                startip = room.ipStart;

                let iparray = startip.split('.');
                iparray[3] = (parseInt(iparray[3]) + 7).toString();
                lastip = iparray.join('.');

            }

            list.push({
                house: house.house,
                room: room.room,
                ip: {
                    start: startip,
                    stop: lastip
                }
            })
        }
    }

    return list;
}
