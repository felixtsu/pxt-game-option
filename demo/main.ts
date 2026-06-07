let optAtk = gameoption.create(img`
    . . 2 . .
    . 2 2 2 .
    2 2 2 2 2
    . 2 2 2 .
    . . 2 . .
`, "攻速")

let optDmg = gameoption.create(img`
    . . 5 . .
    . 5 5 5 .
    5 5 5 5 5
    . 5 5 5 .
    . . 5 . .
`, "伤害")

let picked = gameoption.choose2("选择升级", optAtk, optDmg)
