#!/bin/bash

#### Pretty colors and messaging ####
escape="\033[";
bold="1;"
bblack="${escape}${bold}30m"
red="${escape}31m"
green="${escape}32m"
blue="${escape}34m"
reset="${escape}00m"

#### Functions

##
# Join an array
# @param {string} $1 The delimiter to use to join
# @param {array} $2 The array to join
# @returns The $array joined by $delimiter

function join { local IFS="$1"; shift; echo "$*"; }

#### Get Started

clear

hi="[${red}Creating Player File${reset}]"
nl=$'\n'
player_template="'%pc_name%': {
    'thac0': %pc_thac0%,
    'bonus': %pc_bonus%,
    'weapons': [
        %pc_weapons%
    ]
}"
weapon_template="{ name: '%weapon_name%', type: '%weapon_type%', bonus: %weapon_bonus% }"
player_num=0
weapon_num=0

echo -e "${hi}"

while [[ 'Y' -eq 'Y' ]]; do

    all_players[$player_num]=$player_template

    echo -e "[${green}Step 1 of 3${reset}]"
    echo -e "What's the ${bblack}name${reset} of the PC?"
    read -p "> " pc_name
    all_players[$player_num]=$(echo ${all_players[$player_num]} | sed "s/%pc_name%/$pc_name/")
    echo -e ""

    echo -e "[${green}Step 2 of 3${reset}]"
    echo -e "What's is ${bblack}${pc_name}'s${reset} THAC0?"
    read -p "> " pc_thac0
    all_players[$player_num]=$(echo ${all_players[$player_num]} | sed "s/%pc_thac0%/$pc_thac0/")
    echo -e ""

    echo -e "[${green}Step 3 of 3${reset}]"
    echo -e "What's is ${bblack}${pc_name}'s${reset} to-hit bonus?"
    read -p "> " pc_bonus
    all_players[$player_num]=$(echo ${all_players[$player_num]} | sed "s/%pc_bonus%/$pc_bonus/")

    clear

    while [[ 'Y' -eq 'Y' ]]; do

        player_weapons[$weapon_num]=$weapon_template

        echo -e "${bblack}${pc_name}${reset}"
        echo -e "[${green}Step 3 of 3${reset}]"
        echo -e "[${blue}Sub-step 1 of 3${reset}]"
        echo -e "Name of ${bblack}weapon${reset}?"
        read -p "> " weapon_name
        player_weapons[$weapon_num]=$(echo ${player_weapons[${weapon_num}]} | sed "s/%weapon_name%/${weapon_name}/")
        echo -e ""

        echo -e "[${green}Step 3 of 3${reset}]"
        echo -e "[${blue}Sub-step 2 of 3${reset}]"
        echo -e "What type of weapon is ${bblack}${weapon_name}${reset}?"
        read -p "> " weapon_type
        player_weapons[$weapon_num]=$(echo ${player_weapons[${weapon_num}]} | sed "s/%weapon_type%/${weapon_type}/")
        echo -e ""

        echo -e "[${green}Step 3 of 3${reset}]"
        echo -e "[${blue}Sub-step 3 of 3${reset}]"
        echo -e "What is the bonus for ${bblack}${weapon_name}${reset}?"
        read -p "> " weapon_bonus
        player_weapons[$weapon_num]=$(echo ${player_weapons[${weapon_num}]} | sed "s/%weapon_bonus%/${weapon_bonus}/")
        echo -e ""

        echo -e "Add another ${bblack}weapon${reset}? [Yn]:"
        read -p "> " wyn

        if [ "$wyn" = 'Y' ]; then
            weapon_num=$[weapon_num + 1]
            clear
        else
            # Clean up, get all weapons into the player string
            pc_weapons=$(join , "${player_weapons[@]}")
            all_players[$player_num]=$(echo ${all_players[$player_num]} | sed "s/%pc_weapons%/${pc_weapons}/")
            break;
        fi

    done

    echo -e "Add another ${bblack}player${reset}? [Yn]:"
    read -p "> " pyn

    if [ "$pyn" = 'Y' ]; then
        player_num=$[player_num + 1]
        clear
    else
        # Clean up, get all players into the output string
        final_players=$(join , "${all_players[@]}")
        break;
    fi

done

echo "window.player_data = { $final_players };" > player.js
mv player.js public/player.js

clear
echo -e "${hi}${nl}Done. Player file created."
