
############################################################
# bash settings
############################################################

umask 002

set -o vi
set -o ignoreeof
shopt -s cdspell
shopt -s extglob
shopt -s progcomp
shopt -s nocaseglob

############################################################
# path
############################################################

pathmunge () {
    if ! echo $PATH | /bin/egrep -q "(^|:)$1($|:)" ; then
       if [ "$2" = "after" ] ; then
          PATH=$PATH:$1
       else
          PATH=$1:$PATH
       fi
    fi
}

pathmunge /sbin
pathmunge /usr/sbin
pathmunge $HOME/bin
pathmunge $BIN
unset pathmunge

############################################################
# colors
############################################################

SHOW_COLORS=""
SHOW_COLORS=$SHOW_COLORS'for col in {0..39}; do for line in {0..5}; '
SHOW_COLORS=$SHOW_COLORS'do code=$(( $col * 6 + $line + 16 )); '
SHOW_COLORS=$SHOW_COLORS'printf $'"'"'\e[38;05;%dm %03d'"'"' $code $code ;'
SHOW_COLORS=$SHOW_COLORS'done; echo ;done'
alias colors=$SHOW_COLORS

function colorCode() {
	echo -e "\e[38;5;${1}m"
}

# Foreground
export FG_K=$(colorCode "016") # blacK
export FG_R=$(colorCode "052") # Red
export FG_G=$(colorCode "023") # Green
export FG_Y=$(colorCode "022") # Yellow
export FG_L=$(colorCode "058") # goLd
export FG_B=$(colorCode "017") # Blue
export FG_M=$(colorCode "053") # Magenta
export FG_C=$(colorCode "017") # Cyan (same as blue)
export FG_W=$(colorCode "145") # White
export FG_O=$(colorCode "160") # Orange
export FG_P=$(colorCode "164") # Purple
export FG_D=$(colorCode "040") # Dark grey
export FG_E=$(colorCode "020") # grEy

# Background
export BG_K="\[\e[1;40m\]" # black
export BG_R="\[\e[1;41m\]" # red
export BG_G="\[\e[1;42m\]" # green
export BG_Y="\[\e[1;43m\]" # yellow
export BG_B="\[\e[1;44m\]" # blue
export BG_M="\[\e[1;45m\]" # magenta
export BG_C="\[\e[1;46m\]" # cyan
export BG_W="\[\e[1;47m\]" # white

# No color
export NOCOLOR="\[\e[m\]"

############################################################
# prompt
############################################################

if [ "$PS1" ]; then
    # note placement of \[ and \] - this helps readline figure out the
    # PS1="$FG_D[$FG_E\D{%l:%M%P} $FG_W\u$FG_R@$FG_W\h$FG_E:\w$FG_D]$NOCOLOR\n\$ "
    PS1="$FG_W[\D{%l:%M%P} \u@\h:\w]$NOCOLOR\n\$ "
fi

############################################################
# include external vars
############################################################

source $HOME/.alpharc


export NVM_DIR="/home/sbarrett/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
