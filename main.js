var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
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
    
    //使用するデータ(データオプションへ登録したデータは、すべてリアクティブデータに変換される)
    options: [
      { value: -1, label: 'すべて'},
      { value: 0, label: '作業中'},
      { value: 1, label: '完了'},
    ]
  },

    computed: {
      computedTodos: function() {
        //データcurrentが-1ならすべて
        //それ以外ならcurrentとstateが一致するものだけを返す。
        return this.todos.filter(function(el) {
          return this.current < 0 ? true : this.current === el.state
        }, this)
      },

       // ★STEP13 作業中・完了のラベルを表示する
       labels() {
        return this.options.reduce(function (a, b) {
          return Object.assign(a, { [b.value]: b.label })
        }, {})
        // キーから見つけやすいように、次のように加工したデータを作成
        // {0: '作業中', 1: '完了', -1: 'すべて'}
      }
    },

  // ★STEP8
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // deep オプションでネストしているデータも監視できる
      deep: true
    }
  },

  // ★STEP9
  created() {
    // インスタンス作成時に自動的に fetch() する
    this.todos = todoStorage.fetch()
  },

  methods: {
    doAdd: function(event, value) {
      // ref で名前を付けておいた要素を参照
      var comment = this.$refs.comment
      // 入力がなければ何もしないで return
      if (!comment.value.length) {
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      // フォーム要素を空にする
      comment.value = ''
    },

    doChangeState: function (item) {
      item.state = !item.state ? 1 : 0
    },

    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }

  }
})