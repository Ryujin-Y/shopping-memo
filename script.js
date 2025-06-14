document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.getElementById("add-button");
    const memoInput = document.getElementById("memo-input");
    const memoList = document.getElementById("memo-list");
    const userSelect = document.getElementById("user-select");

    // 現在のユーザー
    let currentUser = userSelect.value;

    // メモ一覧を取得して表示
    async function loadMemos() {
        try {
            const response = await fetch('http://localhost:3000/api/memos');
            const memos = await response.json();
            
            memoList.innerHTML = ""; // 一旦クリア
            memos.forEach((memo, index) => {
                createMemoElement(memo.text, memo.user, index);
            });
        } catch (error) {
            console.error('メモの読み込みに失敗しました:', error);
        }
    }

    // メモの要素を作成してリストに追加
    function createMemoElement(memoText, user, index) {
        const li = document.createElement("li");
        li.dataset.user = user;
        li.dataset.index = index;

        const span = document.createElement("span");
        span.textContent = `${memoText} (by ${user})`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.classList.add("delete-button");

        // 自分のメモのみ削除可能
        if (user === currentUser) {
            deleteButton.addEventListener("click", async function() {
                try {
                    const response = await fetch(`http://localhost:3000/api/memos/${index}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        memoList.removeChild(li);
                    }
                } catch (error) {
                    console.error('メモの削除に失敗しました:', error);
                }
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
    addButton.addEventListener("click", async function() {
        const memoText = memoInput.value.trim();
        if (memoText === "") {
            alert("メモを入力してください");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/memos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: memoText,
                    user: currentUser
                })
            });

            if (response.ok) {
                loadMemos(); // メモ一覧を更新
                memoInput.value = "";
                memoInput.focus();
            }
        } catch (error) {
            console.error('メモの追加に失敗しました:', error);
        }
    });

    // ユーザー選択が変わったとき
    userSelect.addEventListener("change", function() {
        currentUser = userSelect.value;
        loadMemos();
    });

    // 初回ロード時にメモを読み込み
    loadMemos();
});