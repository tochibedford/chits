const electron = require('electron');
const url = require('url');
const path = require('path');
const getmac = require('getmac').default;
const os = require("os");
const fs = require('fs');


const {app, BrowserWindow, Menu} = electron;

//get computer mac address and hostname and date

var getDateToday = () =>{
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); 
	var yyyy = today.getFullYear();
	today = mm + '/' + dd + '/' + yyyy;
	return today;
}

try{
	let d = getDateToday();
	let mac = getmac();
	let hostname = os.hostname();
	let curUserData = {"name": "", "pcName": hostname, "macNumber": mac, "date": d};


	data = fs.readFileSync(path.join(__dirname, "userDt.json"), 'utf-8');
	var y = JSON.parse(data);

	for(let i=0; i<Object.keys(y[y.length-1]).length; i++){
		if( y[y.length-1][Object.keys(y[y.length-1])[i]] != curUserData[Object.keys(y[y.length-1])[i]]){
			y.push(curUserData);
			y = JSON.stringify(y);
			fs.writeFileSync(path.join(__dirname, "userDt.json"), y);
			break;
		}
	}
}catch{
	data = fs.readFileSync(path.join(__dirname, "userDt.json"), 'utf-8');
	var y = JSON.parse(data);
	let d = getDateToday();
	let mac = y[y.length-1]['macNumber']
	let hostname = os.hostname();
	let curUserData = {"name": "", "pcName": hostname, "macNumber": mac, "date": d};

	for(let i=0; i<Object.keys(y[y.length-1]).length; i++){
		if( y[y.length-1][Object.keys(y[y.length-1])[i]] != curUserData[Object.keys(y[y.length-1])[i]]){
			y.push(curUserData);
			y = JSON.stringify(y);
			fs.writeFileSync(path.join(__dirname, "userDt.json"), y);
			break;
		}
	}
}

//electron app
let mainWindow;
let mainMenuTemplate=[];

//listen for app to be ready
app.on('ready', ()=>{
	//create window
	mainWindow = new BrowserWindow({
		height: 500,
		width: 500,
		title: 'Chits',
		frame: false,
		resizable: false,
		titleBarStyle: 'hidden',
		transparent: true,
	});

	//load html
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true,
	}))

	mainWindow.on('closed', ()=>{
		app.quit();
	})
	//build menu from template
	var mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//insert Menu
	Menu.setApplicationMenu(mainMenu)
})



if(process.env.NODE_ENV != 'production'){
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu:[
			{
				label: "Quit",
				accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
				click(){
					app.quit();
				}
			},
			{
				label: "Toggle DevTools",
				accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				},
			},
			{
				role: 'reload',
			}
		]
	})
}