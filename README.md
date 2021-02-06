# SOMeL
Self Organizing Map e-Learningの頭文字からなるSOMeL(染める)．

機械学習手法の一つであるSOM（自己組織化マップ）を直感的に理解するためのデモプログラムである．


# Overview
Self Organizing Map（自己組織化マップ）はT.Kohonenによって開発された教師なし学習手法で，高次元データを低次元に写像することができる．

SOMeLでは，SOMによって色配列を3次元（RGB）から2次元（位置）に変換している．
似た色（RGBの値が近い色）同士は近くにマッピングされる．


# Description
アルゴリズムは以下の通りである．
1. マッピング用の2次元色配列をランダムに与える．<br><img src="https://user-images.githubusercontent.com/64676197/107116802-2261b800-68b9-11eb-872c-4544068f150f.png" width="300px">
2. 1の配列のうち，各入力の色に最も近い要素とその周囲の要素に入力の色を加える．<br><img src="https://user-images.githubusercontent.com/64676197/107116809-2d1c4d00-68b9-11eb-8802-07ac7720f1ae.png" width="300px">
3. 色を変更する範囲と度合いを小さくする
4. 2,3を繰り返す．
<br>
実行すると以下のようになる．

![demo](https://user-images.githubusercontent.com/64676197/107117100-25f63e80-68bb-11eb-9f8a-544c436d0945.gif)


# Usage
 - **start**...SOMを実行．
 - **stop**...一時停止．
 - **next**...1入力のみ実行．ひとつずつ見ながら理解するために使う．
 - **test**...入力のうちTestとRGB距離が最も近い色（Truth）と平面上の距離が最も近い色（Pred）が一致しているかを確かめ，正解率を算出する．
 - **reset panel**...マッピング用2次元色配列をリセット．
 - **reset**...マッピング用2次元色配列と入力をリセット．
<img src="https://user-images.githubusercontent.com/64676197/107116814-34435b00-68b9-11eb-8b97-e060c98e1ed9.png" width="360px">
