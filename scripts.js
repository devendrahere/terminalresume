console.log('Terminal ready')
let currentVariable = ""
const aliases = {
    h: "help",
    a: "about",
    s: "skills",
    p: "projects",
    c: "contact",
    ce: "copy email",
    cg: "copy github",
    cl: "copy linkedin"
}
const commands = ["help", "about", "skills", "projects", "contact", "copy email", "copy github", "copy linkedin"]
let history = [];
let historyindex = -1;

document.addEventListener("keydown", (event) => {
    if (event.key == "Backspace") {
        event.preventDefault();
        currentVariable = currentVariable.slice(0, -1);
    }
    else if (event.key == "Enter") {
        const output = document.getElementById("output");
        const newline = document.createElement("div");
        newline.textContent = ">" + currentVariable;
        output.append(newline);
        handleCommand(currentVariable);
        history.unshift(currentVariable);
        historyindex = -1;
        currentVariable = ""
    }
    else if (event.key == "ArrowUp") {
        if (historyindex < history.length) {
            historyindex++;
            currentVariable = history[historyindex];
        }
    }
    else if (event.key == "ArrowDown") {
        if (historyindex > 0) {
            historyindex--;
            currentVariable = history[historyindex];
        }
        else {
            historyindex = -1;
            currentVariable = ""
        }
    }
    else if (event.key == "Tab") {
        event.preventDefault();
        const suggestions = commands.filter(cmd => cmd.startsWith(currentVariable.toLowerCase()));
        if (suggestions.length == 1) {
            currentVariable = suggestions[0];
        }
        else if (suggestions.length == 1) {
            const output = document.getElementById("output");
            const suggestionLine = document.createElement("div");
            suggestionLine.textContent = "suggestion: " + suggestions.join(" | ");
            output.appendChild(suggestionLine);
        }
    }
    else if (event.key.length == 1) {
        currentVariable += event.key;
    }
    document.getElementById("typed").textContent = ">" + currentVariable;
})

function handleCommand(input) {
    const output = document.getElementById("output");
    const response = document.createElement("div");

    input = input.toLowerCase().trim();
    if (aliases[input]) input = aliases[input];

    let reply = "";
    if (input.startsWith("copy ")) {
        const parts = input.trim().split(/\s+/);
        const copyTarget = parts[1]?.toLowerCase();
        const copyMap = {
            email: "devendrac2323@gmail.com",
            github: "https://github.com/devendrahere",
            linkedin: "https://www.linkedin.com/in/idevendrahere"
        };
        const toCopy = copyMap[copyTarget];
        if (toCopy) {
            navigator.clipboard.writeText(toCopy).then(() => {
                const confirm = document.createElement("div");
                confirm.textContent = `Copied to clipboard ${toCopy}`;
                output.appendChild(confirm);
            }).catch(() => {
                const error = document.createElement("div");
                error.textContent = `Failed to copy to clipboard`
                output.appendChild(error);
            });
        } else {
            const confirm = document.createElement("div");
            confirm.textContent = `Unknown Copy target: ${copyTarget}`;
            output.appendChild(confirm);
        }
        return;
    }
    if (input.startsWith("theme")) {
        const mode = input.split(/\s+/)[1];

        const setTheme = (mode) => {
            if (mode === "light") {
                document.documentElement.classList.add("light-theme");
                localStorage.setItem("theme", "light");
                return " Light theme enabled.";
            } else if (mode === "dark") {
                document.documentElement.classList.remove("light-theme");
                localStorage.setItem("theme", "dark");
                return " Dark theme enabled.";
            } else if (mode === "toggle") {
                const isLight = document.documentElement.classList.toggle("light-theme");
                localStorage.setItem("theme", isLight ? "light" : "dark");
                return `Theme toggled to ${isLight ? "light" : "dark"}.`;
            } else {
                return " Usage: theme light | dark | toggle";
            }
        };

        const themeReply = setTheme(mode);
        response.textContent = themeReply;
        output.appendChild(response);
        return;
    }
    switch (input) {
        case "help":
            reply = `
Available Commands:\n
help\t:\tHelp commands\n
about\t:\tWho am I\n
skills\t:\tMy skill set\n
projects\t:\tMy Projects\n
contact\t:\tHow to reach me\n
copy <item>\t:\tCopy email,github,or linkedin\n
theme [mode] : Set or toggle theme (light | dark | toggle)
`;
            break;

        case "about":
            reply = "I’m Devendra C — a web developer crafted this terminal-style resume.";
            break;

        case "skills":
            reply = `
Languages :\tJava, Python, C
Frontend :\tHTML, CSS, JavaScript
Backend :\tLearning
Tools :\tGit, VSCode, Figma, Unreal Engine 5
`;
            break;

        case "projects":
            reply = `
File Organiser : Python-based tool to auto-sort files into folders.
Terminal Resume : This very terminal-style resume.
More : Currently working on more…
`;
            break;

        case "contact":
            reply = `
Mail :\tdevendrac2323@gmail.com
GitHub :\thttps://github.com/devendrahere
LinkedIn :\thttps://www.linkedin.com/in/idevendrahere
`;
            break;
        default:
            reply = `Command not found: ${input}`;
    }

    output.appendChild(response);
    typeOut(reply, response);
}

function scolltobottom() {
    window.scrollTo({
        bottom: document.body.scrollHeight, behavior: "smooth"
    })
}
function typeOut(text, targetElement, callback) {
    let i = 0;
    targetElement.innerHTML = "";

    const chars = text.split("");

    const interval = setInterval(() => {
        const char = chars[i]
            .replace(/\n/g, "<br>")
            .replace(/\t/g, "&emsp;");

        targetElement.innerHTML += char;
        i++;
        if (i >= chars.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 15);
}
const savedTheme = localStorage.getItem("theme");
if (savedTheme == "light") {
    document.documentElement.classList.add("light-theme");
}
window.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const intro = document.createElement("div");

  const introText = `Welcome to Devendra's Terminal Resume.\nType 'help' to get started.\n`;
  
  typeOut(introText, intro, 35, () => {

    document.getElementById("input-line").style.visibility = "visible";
  });
 // hide initially
  output.appendChild(intro);
});
