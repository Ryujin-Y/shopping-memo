document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("add-button");
    const memoInput = document.getElementById("memo-input");
    const memoList = document.getElementById("memo-list");
    const userSelect = document.getElementById("user-select");

    // 現在のユーザー
    let currentUser = userSelect.value;

    // localStorage からメモ一覧を読み込んで表示
    function loadMemos() {
        memoList.innerHTML = ""; // 一旦クリア
        const memos = JSON.parse(localStorage.getItem(`memos_${currentUser}`)) || [];
        memos.forEach(memoText => {
            createMemoElement(memoText);
        });
    }

    // localStorage にメモ一覧を保存
    function saveMemos() {
        const memos = [];
        document.querySelectorAll("#memo-list li span").forEach(span => {
            memos.push(span.textContent);
        });
        localStorage.setItem(`memos_${currentUser}`, JSON.stringify(memos));
    }

    // メモの要素を作成してリストに追加
    function createMemoElement(memoText) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = memoText;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", function() {
            memoList.removeChild(li);
            saveMemos(); // 削除後に保存
        });

        li.appendChild(span);
        li.appendChild(deleteButton);

        memoList.appendChild(li);
    }

    // 追加ボタンが押されたとき
    addButton.addEventListener("click", function() {
        const memoText = memoInput.value.trim();
        if (memoText === "") {
            alert("メモを入力してください");
            return;
        }

        createMemoElement(memoText);
        saveMemos(); // 追加後に保存

        memoInput.value = "";
        memoInput.focus();
    });

    // ユーザー選択が変わったとき
    userSelect.addEventListener("change", function() {
        currentUser = userSelect.value;
        loadMemos();
    });

    // 初回ロード時に現在のユーザーのメモを読み込み
    loadMemos();
});