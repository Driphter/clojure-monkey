(ns clojure-monkey.core
  (:require cljs.js
            clojure.string
            [goog.crypt.base64 :as base64]))

(def sourcemap-to-ast! (js/require "sourcemap-to-ast"))

(def esprima (js/require "esprima"))

(def esprima-options
  #js {:loc true
       :range false
       :tokens false
       :comment false
       :tolerant false})

(def cljs-options
  {:source-map true})

(def sourcemap-pattern
  #"\n//# sourceMappingURL=data:application/json;base64,([^\n]*)$")

(defn get-sourcemap
  [jscode]
  (let [sm (->> (second (re-find sourcemap-pattern jscode))
                (base64/decodeString)
                (.parse js/JSON))]
    ;; Needed for a bug in the source-map module.
    ;; We don't care about the names anyways.
    (.push (.-names sm) "")
    sm))

(defn cljs->js-code
  [cljscode]
  (let [st (cljs.js/empty-state)]
    (cljs.js/compile-str st cljscode nil cljs-options #(:value %))))

(defn cljs->js-ast
  [cljscode]
  (let [jscode  (cljs->js-code cljscode)
        sm      (get-sourcemap jscode)
        ast     (.parse esprima jscode esprima-options)]
    (sourcemap-to-ast! ast sm)))

(set! *main-cli-fn* (fn [] nil))
(set! (.-exports js/module) #js {:parseToAST cljs->js-ast
                                 :parseToJS cljs->js-code
                                 :cljs #js {:core (.-core js/cljs)}
                                 :jsToCLJ js->clj})
