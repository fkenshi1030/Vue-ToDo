var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
//コンストラクタ関数Vueを使ってルートインスタンス作成
//アプリケーションで使用したいデータはdataオプションへ登録
new Vue ({
  el: '#app',
  data: {
    //選択しているoptionsのvalueを保存するためのもの
    //初期値を-1ですべてとしている。
    todos: [],
    //ToDoの状態を表している
    current: -1,
    
    //使用するデータ(データオプションへ登録したデータは、すべてリアクティブデータに変換される)/
    options: [
      { value: -1, label: 'すべて'},
      { value: 0, label: '作業中'},
      { value: 1, label: '完了'},
    ]
  },

    methods: {
      //ToDo 追加の管理
    doAdd: function(event, value) {
        //ref で名前をつけておいた要素を参照
      var comment = this.$refs.comment
      //入力がなければ何もしないで return
      if (!comment.value.length) {
        return
      }
      // {新しいID, コメント, 作業状態}
      // というオブジェクトを現在のtodosリストへpush
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      //フォーム要素を空にする
      comment.value = ''
    },
    watch: {
      todos: {
        handler: function(todos) {
          todoStorage.save(todos)
        },
        deep: true
      }
    },
    created() {
      this.todos = todoStorage.fetch()
    }
  }
})