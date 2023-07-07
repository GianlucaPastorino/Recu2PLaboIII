const url = "http://localhost:3000/superheroes";
const $loader = document.getElementById("spinner");


export const getSuperheroes = async ()=>{
    try {
        let res = await fetch(url);
        if(!res.ok) throw Error(`Error: ${res.status}. ${res.statusText}`);

        return await res.json();

    } catch (err) {
        alert(err.message);
    }
}

export const createSuperheroe = (superheroe)=>{

    $loader.classList.remove("ocultar");

    const xhr = new XMLHttpRequest(); 

    xhr.addEventListener("readystatechange", ()=>{
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status < 300){ 
                const data = JSON.parse(xhr.responseText); 
            }
            else{
                alert(`Error: ${xhr.status}. ${xhr.statusText}`);
            }
            $loader.classList.add("ocultar");
        }
    })

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(superheroe));
}



export const deleteSuperheroe = (id)=>{ 
    $loader.classList.remove("ocultar");

    const xhr = new XMLHttpRequest(); 

    xhr.addEventListener("readystatechange", ()=>{
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status < 300){ 
                const data = JSON.parse(xhr.responseText);
            }
            else{
                alert(`Error: ${xhr.status}. ${xhr.statusText}`);
            }
            $loader.classList.add("ocultar");
        }
    })
   
    xhr.open("DELETE", url + "/" + id); 
    xhr.send();
}



export const updateSuperheroe = (id, superheroe)=>{
    $loader.classList.remove("ocultar");

    const xhr = new XMLHttpRequest(); 

    xhr.addEventListener("readystatechange", ()=>{
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status < 300){ 
                const data = JSON.parse(xhr.responseText);
            }
            else{
                alert(`Error: ${xhr.status}. ${xhr.statusText}`);
            }
            $loader.classList.add("ocultar");
        }
    })

    xhr.open("PUT", url + "/" + id);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8"); 
    xhr.send(JSON.stringify(superheroe));
}