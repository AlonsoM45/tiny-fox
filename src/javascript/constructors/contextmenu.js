import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

function ContextMenu({
    list,
    parent,
    event
}){

    const ContextWrapper = puffin.style.div`
        ${ThemeProvider}
        &{
            background:{{contextmenuBackground}};
            padding:5px;
            position:fixed;
            color:white;
            border-radius:5px;
            box-shadow:0px 0px 3px rgba(0,0,0,0.2);
            display:block;
        }
        & > button{
            background:{{contextmenuButtonBackground}};
            color:{{contextmenuButtonText}};
            border:0;
            padding:6px;
            outline:0;
            border-radius:5px;
            display:block;
            width:100%;
            text-align:left;
        }
        & >  button:hover{
            background:{{contextmenuButtonHoveringBackground}};
            color:{{contextmenuButtonHoveringText}};
        }
        & >  span{
            height:1.5px;
            border-radius:25px;
            width:95%;
            display:block;
            background:{{contextmenuDivider}};
            margin:3px auto;
        }

    `
    const randomID = Math.random()
    const contextMenusCreated = document.getElementsByClassName("contextMenu");
    const computedMethods = {...list.map(a=>a.action)}
    if(contextMenusCreated.length != 0) {
        contextMenusCreated[0].remove()
    }
    const ContextComponent = puffin.element(`
            <ContextWrapper id="${randomID}" class="contextMenu" style="top:${event.pageY}px; left:${event.pageX};">
                ${(function(){
                    let content = "";
                        list.map((option,index)=>{
                            if(option.label != undefined){
                                content += `<button click="$${index}">${option.label}</button>`
                            }else{
                                content += `<span></span>`
                            }
                            
                        })
                    return content
                })()}
            </ContextWrapper>
        `,{
            methods:computedMethods,
            components:{
                ContextWrapper
            },
            events:{
                mounted(target){
                    parent.setAttribute("hasContext","true")
                    window.addEventListener("click",(e)=>{
                        target.remove()
                    })
                    window.addEventListener("contextmenu",(e)=>{
                        e.stopPropagation()
                        
                    })
                }
            }
        })
        puffin.render(ContextComponent,document.body) 
}

export default ContextMenu