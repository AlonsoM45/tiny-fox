import { Shortcuts } from 'shortcuts'
import { Panel, removePanel } from '../constructors/panel'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CommandPrompt from '../constructors/command.prompt'
import PluginsRegistry from 'PluginsRegistry'
import About from './dialogs/about'
import Languages from '../../../languages/*.json'
import configEditor from './tabs/config.editor.js'
import Settings from './windows/settings'
import Welcome from "./windows/welcome";
import Store from './windows/store'

RunningConfig.on('command.saveCurrentFile',()=>{
	RunningConfig.data.focusedTab && RunningConfig.data.focusedTab.props.state.emit('savedMe')
})
RunningConfig.on('command.newPanel',()=>{
	new Panel()
})
RunningConfig.on('command.closeCurrentTab',()=>{
	if( RunningConfig.data.focusedTab != null ) { //Check if there is any opened tab
		RunningConfig.data.focusedTab.props.state.emit('close')
	}
})
RunningConfig.on('command.closeCurrentPanel',()=>{
	removePanel()
})
RunningConfig.on('command.openCommandPrompt',()=>{
	new CommandPrompt({
		name:'global',
		showInput:true,
		inputPlaceHolder:'Enter a command',
		options:[
			{
				label:'Open Settings',
				action:()=>Settings().launch()
			},{
				label:'Open Projects',
				action:()=>Welcome().launch()
			},{
				label:'Open Workspaces',
				action:()=>{
					Welcome({
						defaultPage : 'workspaces'
					}).launch()
				}
			},{
				label:'Open Store',
				action:()=>Store().launch()
			},{
				label:'Open About',
				action:()=>About().launch()
			},{
				label:'Open Manual Configuration',
				action:()=>configEditor()	
			},{
				label:'Set theme',
				action:()=>{
					const configuredTheme = StaticConfig.data.appTheme
					new CommandPrompt({
						showInput:true,
						inputPlaceHolder:'Select a theme',
						options:(function(){
							const list = []
							const registry = PluginsRegistry.registry.data.list
							Object.keys(registry).filter(function(name){
								const plugin = registry[name]
								console.log(configuredTheme,name,configuredTheme==name)
								if(plugin.type == "theme"){
									list.push({
										label:name,
										selected:configuredTheme == name
									})
								}
							})
							return list;
						})(),
						onSelected(res){
							StaticConfig.data.appTheme = res.label
						},
						onScrolled(res){
							StaticConfig.data.appTheme = res.label
						}
					})
				}
			},{
				label:'Set Language',
				action:()=>{
					const configuredLanguage = StaticConfig.data.language
					new CommandPrompt({
						showInput:true,
						inputPlaceHolder:'Select a language',
						options:(function(){
							const list = []
							Object.keys(Languages).filter(function(name){
								list.push({
									label:name,
									selected:configuredLanguage == name
								})
							})
							return list;
						})(),
						onSelected(res){
							StaticConfig.data.appLanguage = res.label
						},
						onScrolled(res){
							StaticConfig.data.appLanguage = res.label
						}
					})
				}
			},
			...RunningConfig.data.globalCommandPrompt
		]
	})
})
RunningConfig.on('command.openCurrentPanelTabsIterator',()=>{
	if( RunningConfig.data.focusedTab ){
		const focusedPanelTabs = RunningConfig.data.focusedTab.getPanelTabs()
		new CommandPrompt({
			name:'tab_switcher',
			showInput:false,
			scrollOnTab:true,
			closeOnKeyUp:true,
			inputPlaceHolder:'Enter a command',
			options:[...focusedPanelTabs.map((tab)=>{
				return {
					label:tab.fileName
				}
			})],
			onSelected(res){
				const toFocusTab = focusedPanelTabs.filter((tab)=>{
					return tab.fileName == res.label
				})[0]
				toFocusTab && toFocusTab.element.props.state.emit('focusedMe')
			}
		})
	}
})
RunningConfig.on('command.increaseFontSize',({factor=2}={factor:2})=>{
	StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize)+factor
})
RunningConfig.on('command.decreaseFontSize',({factor=2}={factor:2})=>{
	StaticConfig.data.editorFontSize = Number(StaticConfig.data.editorFontSize)-factor
})
RunningConfig.on('command.closeCurrentWindow',({factor=2}={factor:2})=>{
	const windows = document.getElementById("windows").children
	windows[windows.length-1].remove()
})
const appShortCuts = new Shortcuts ();
appShortCuts.add ([ 
	...StaticConfig.data.appShortcuts.SaveCurrentFile.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.saveCurrentFile')
		}
	}),
	...StaticConfig.data.appShortcuts.NewPanel.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.newPanel')
		}
	}),
	...StaticConfig.data.appShortcuts.CloseCurrentTab.combos.map(shortcut=>{
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.closeCurrentTab')
		}
	}),
	...StaticConfig.data.appShortcuts.CloseCurrentPanel.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.closeCurrentPanel')
		}
	}),
	...StaticConfig.data.appShortcuts.OpenCommandPrompt.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.openCommandPrompt')
		}
	}),
	...StaticConfig.data.appShortcuts.IterateCurrentPanelTabs.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.openCurrentPanelTabsIterator')
		}
	}),
	...StaticConfig.data.appShortcuts.IncreaseEditorFontSize.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.increaseFontSize')
		}
	}),
	...StaticConfig.data.appShortcuts.DecreaseEditorFontSize.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.decreaseFontSize')
		}
	}),
	...StaticConfig.data.appShortcuts.CloseCurrentWindow.combos.map(shortcut=>{ 
		return { 
			shortcut:shortcut, handler: event => RunningConfig.emit('command.closeCurrentWindow')
		}
	})
]);