const TemplateEngine = function(html, options){
       
    let dynamicBlockRegex = /<%([^%>]+)?%>/g, match
    let escapeables = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g

    
    let code = ['var lines=[];\n']
    let cursor = 0
    
    var add = function(line, js){
        js? code += line.match(escapeables) ? line + '\n' : 'lines.push(' + line + ');\n' :
        code += 'lines.push("' + line.replace(/"/g, '\\"') + '");\n';
    }

    while(match = dynamicBlockRegex.exec(html)) {
        add(html.slice(cursor, match.index))
        add(match[1], true)
        cursor = match.index + match[0].length;
        console.log(html)
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return lines.join("");';
    console.log(code)
    // Apply roept de functie aan met de scope & parameters gegeven
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

export { TemplateEngine };
