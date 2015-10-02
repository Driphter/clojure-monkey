var clojureMonkey = require('../clojure_monkey');

window.clojureMonkey = clojureMonkey;
window.cljs = clojureMonkey.cljs;

evalButton = document.getElementById('evalButton');

cljsEditor = ace.edit("cljsEditor")
cljsEditor.setTheme("ace/theme/solarized_light");
cljsEditor.getSession().setTabSize(2);
cljsEditor.getSession().setMode("ace/mode/clojure");

astEditor = ace.edit("astEditor")
astEditor.setTheme("ace/theme/solarized_light");
astEditor.getSession().setTabSize(4);
astEditor.getSession().setMode("ace/mode/json");
astEditor.setOption('showLineNumbers', false);
astEditor.setReadOnly(true);

jsEditor = ace.edit("jsEditor")
jsEditor.setTheme("ace/theme/solarized_light");
jsEditor.getSession().setTabSize(4);
jsEditor.getSession().setMode("ace/mode/javascript");
jsEditor.setReadOnly(true);

evalEditor = ace.edit("evalEditor")
evalEditor.setTheme("ace/theme/solarized_light");
evalEditor.getSession().setMode("ace/mode/clojure");
evalEditor.renderer.setShowGutter(false);
evalEditor.setReadOnly(true);

parseInput = function() {
    var cljsCode = cljsEditor.getSession().getValue();
    try {
        var ast = clojureMonkey.parseToAST(cljsCode);
        var formattedAst = JSON.stringify(ast, null, 4);
        astEditor.getSession().setValue(formattedAst);
        var jsCode = clojureMonkey.parseToJS(cljsCode);
        jsEditor.getSession().setValue(jsCode);
    } catch (e) {
        astEditor.getSession().setValue('');
    }
}

parseInput();

var timeout = null;
cljsEditor.getSession().on('change', function (e) {
    clearTimeout(timeout);
    timeout = setTimeout(parseInput, 200);
});

evalCode = function (){
    cljs.user = {};
    cljs.user.this = window;
    var cljsCode = cljsEditor.getSession().getValue();
    try {
        cljsCode = '((fn[](do ' + cljsCode + ')))';
        var jsCode = clojureMonkey.parseToJS(cljsCode);
        var output = eval(jsCode);
        if (typeof output === "undefined")
            output = "nil";
        evalEditor.getSession().setValue(output + '');
    } catch (e) {
        output = e.message;
        if (e.name) output = e.name + ": " + output;
        evalEditor.getSession().setValue(output);
    }
};

evalButton.onclick = evalCode;
evalButton.click();


