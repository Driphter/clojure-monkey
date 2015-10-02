(require '[cljs.build.api :as b])

(b/watch "src"
  {:main 'clojure-monkey.core
   :output-to "out/clojure_monkey.js"
   :output-dir "out"})
