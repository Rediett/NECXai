if(window.innerWidth <= 500) {
    alert("For this demo you must use a divice with a bigger screen!");
    window.location.reload();
}

var prompts = "";
addchat("Hey, how may I help you? Can you briefly describe your situation for me please?", false);
var sugServices = []
async function getans(p) {
    var fdata = "NO RESPONCE!!";
    var pp = "(side note: you are a victim services provider!,if i stop the conversation stop suggesting, be friendly!,continue the conversation,brife answers, suggest list of victim sevices that best fit my situation,!only suggest services!,say you will suggest services that might help, !must return format response = 'answer: [put answer here in sentences, about the services too],'ServiceSuggest': [list of victim services to help me(no sentence, no filler or trannsition words, use comma, no bullet points!)]'";
    var ppp = prompts.replace(/(\r\n|\n|\r)/gm, "");
    await fetch("https://symphonious-phoenix-6a32e6.netlify.app/.netlify/functions/Routs/GPT", {
    body: '{"prompt": "(background info:'+ppp+') Main-Question=>'+p+' '+pp+'"}',
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    }).then(response => response.json()).then(data => { fdata = (data.msg); }).catch(error => console.error(error));
    document.getElementById("prompt").disabled = false;
    document.getElementById("sendbtn").disabled = false;
    fdata = fdata.replace(/(\r\n|\n|\r)/gm, "");
    console.log(fdata);
    try {
        var services = fdata.split("ServiceSuggest: ")[1];
        var lserv = services.split(",");
        if (lserv.length > 0) {
            document.getElementById("sliderArrow").hidden = false;
            lserv.forEach((item, index) => {
                if (!sugServices.includes(item)) {
                    sugServices.push(item);
                    showServices(item);
                }
            })
        } else {
            document.getElementById("sliderArrow").hidden = true;
        }
    } catch (error) {
        
    }
    document.getElementById("prompt").innerHTML = "";
    var ans = (fdata.split("ServiceSuggest: ")[0]).split("Answer: ")[1];
    return ans;
}
// showServices("Victims of their rights")
function showServices(service) {
    var card = document.createElement('div');
    card.classList.add("card");
    card.setAttribute("onclick", "ask('Tell me more about "+service+"');");

    var row = document.createElement('div');
    row.classList.add("row", "justify-content-center", "align-items-center","g-2");
    
    var col1 = document.createElement('div');
    col1.classList.add("col-10");
    col1.innerHTML = service;
    
    var col2 = document.createElement('div');
    col2.classList.add("col-1");
    var arrow = document.createElement('img');
    arrow.setAttribute("src", "./assets/arrow-34.svg");
    arrow.setAttribute("height", "20");
    col2.appendChild(arrow);

    row.appendChild(col1);
    row.appendChild(col2);
    card.appendChild(row);
    document.getElementById("services").appendChild(card);
}

async function ask(q) {
    document.getElementById("prompt").value = q;
    await btn.click();
}

function addchat(msg, q) {
    console.log(msg);
    if (p) {
        prompts += "!Question!>" + msg;
    } else {
        prompts += "!Responce!>" + msg;
    }
    var ansbox = document.createElement('div');
    ansbox.classList.add("row", "ansbox", "question");
    if (!q) {
        ansbox.classList.add("row", "ansbox", "response");
    }
    
    var ansboxelem1 = document.createElement('div');
    ansboxelem1.classList.add("col-3", "ansboxelem");
    ansboxelem1.style.paddingLeft = "20%";

    var profile = document.createElement('img');
    profile.setAttribute("src", "./assets/person-4.svg");
    profile.setAttribute("height", "30");
    profile.style.backgroundColor = "white";
    if (q == false) {
        profile = document.createElement('img');
        profile.setAttribute("src", "./assets/IMG_9611 copy.jpg");
        profile.setAttribute("height", "30");
    }
    ansboxelem1.appendChild(profile);

    var ansboxelem2 = document.createElement('div');
    ansboxelem2.classList.add("col-9", "ansboxelem");
    var p = document.createElement('p');
    p.innerText = msg;
    ansboxelem2.appendChild(p);
    
    ansbox.appendChild(ansboxelem1);
    ansbox.appendChild(ansboxelem2);
    document.getElementById("chatcont").appendChild(ansbox);
}

var btn = document.getElementById("sendbtn");
btn.addEventListener("click", async () => {
    var prompt = document.getElementById("prompt").value;
    document.getElementById("prompt").disabled = true;
    document.getElementById("sendbtn").disabled = true;
    addchat(prompt,true);
    var response = await getans(prompt);
    addchat(response, false);
    
})

document.getElementById("prompt").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        btn.click();
    }
})

