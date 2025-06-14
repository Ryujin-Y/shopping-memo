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
        const memos = JSON.parse(localStorage.getItem("shared_memos")) || [];
        memos.forEach(memo => {
            createMemoElement(memo.text, memo.user);
        });
    }

    // localStorage にメモ一覧を保存
    function saveMemos() {
        const memos = [];
        document.querySelectorAll("#memo-list li").forEach(li => {
            const text = li.querySelector("span").textContent;
            const user = li.dataset.user;
            memos.push({ text, user });
        });
        localStorage.setItem("shared_memos", JSON.stringify(memos));
    }

    // メモの要素を作成してリストに追加
    function createMemoElement(memoText, user) {
        const li = document.createElement("li");
        li.dataset.user = user;

        const span = document.createElement("span");
        span.textContent = `${memoText} (by ${user})`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.classList.add("delete-button");

        // 自分のメモのみ削除可能
        if (user === currentUser) {
            deleteButton.addEventListener("click", function() {
                memoList.removeChild(li);
                saveMemos(); // 削除後に保存
            });
        } else {
            deleteButton.disabled = true;
            deleteButton.style.opacity = "0.5";
        }

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

        createMemoElement(memoText, currentUser);
        saveMemos(); // 追加後に保存

        memoInput.value = "";
        memoInput.focus();
    });

    // ユーザー選択が変わったとき
    userSelect.addEventListener("change", function() {
        currentUser = userSelect.value;
        loadMemos();
    });

    // 初回ロード時にメモを読み込み
    loadMemos();
});