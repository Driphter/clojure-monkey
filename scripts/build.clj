(require '[cljs.build.api :as b])

(println "Building ...")

(let [start (System/nanoTime)]
  (b/build "src"
    {:main 'clojure-monkey.core
     :output-to "clojure_monkey.js"
     :output-dir "out"
     :verbose true
     :optimizations :simple
     :pretty-print false
     :target :nodejs})
  (println "... done. Elapsed" (/ (- (System/nanoTime) start) 1e9) "seconds"))


