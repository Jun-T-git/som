# Let's Enjoy SOM！
SOM（自己組織化マップ）を直感的に理解するためのデモプログラム．


# Overview
Self Organizing Map（自己組織化マップ）はT.Kohonenによって開発された教師なし学習手法で，高次元データを低次元に写像することができる．

本プログラムでは，SOMによって色配列を3次元（RGB）から2次元（位置）に変換している．
似た色（RGBの値が近い色）同士は近くにマッピングされる．


# Description
アルゴリズムは以下の通りである．
1. マッピング用の2次元色配列をランダムに与える．
<img src="https://user-images.githubusercontent.com/64676197/107116802-2261b800-68b9-11eb-872c-4544068f150f.png" width="360px">
2. 3以降を繰り返す．
3. 全入力に対して4を行う．
4. 1の配列のうち，入力の色に最も近い要素とその周囲の要素に入力の色を加える．
<img src="https://user-images.githubusercontent.com/64676197/107116809-2d1c4d00-68b9-11eb-8802-07ac7720f1ae.png" width="360px">
5. 色を変更する範囲と度合いを小さくする

![demo](https://user-images.githubusercontent.com/64676197/107116866-87b5a900-68b9-11eb-8f76-071cca8d1171.gif)


# Usage
 - **start**...SOMを実行．
 - **stop**...一時停止．
 - **next**...1入力のみ実行．ひとつずつ見ながら理解するために使う．
 - **test**...入力のうちTestとRGB距離が最も近い色（Truth）と平面上の距離が最も近い色（Pred）が一致しているかを確かめ，正解率を算出する．
 - **reset panel**...マッピング用2次元色配列をリセット．
 - **reset**...マッピング用2次元色配列と入力をリセット．
<img src="https://user-images.githubusercontent.com/64676197/107116814-34435b00-68b9-11eb-8b97-e060c98e1ed9.png" width="360px">
