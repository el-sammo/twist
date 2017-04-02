var candidate = {};

candidate.information = {
	fName: 'Jon',
	lName: 'Barrett',
	email: 'jonab1974@gmail.com',
	phone: 7024270694,
	github: 'https://github.com/jab74',
	skype: 'jonab1974@gmail.com',
	address: '842 S. Washington St.',
	city: 'Casper',
	state: 'WY',
	zip: 82601,
	shirtSize: 'XL'
};

candidate.aboutMe = 'I\'m a full-stack developer (over 14 years!) interested in performing a leading role in the development, deployment, and maintenance of your product. While you\'re looking for a developer with React experience, I\'m looking for a new opportunity to learn React - what a neat coincidence!  :-)';

candidate.qualifications = [
	{type: 'leader', rating: 8, description: 'I have enjoyed, at various times in my career, the opportunity to lead small, diverse teams as either a team lead, scrum master or both.'},
	{type: 'riskTaking', rating: 8, description: 'I\'ve never been one to shy away from a challenge or to battle a new puzzle into the wee hours of the night - I\'m also experienced enough to know when to timebox an issue and request assistance when the bears in the campground are too numerous to fight alone.'},
	{type: 'teamPlayer', rating: 7, description: 'I derive immense satisfaction from being part of a team that delivers bug-free, feature-packed, kick-ass end-user experiences; I don\'t need to be acknowledged for my contributions (however great they may be).'},
	{type: 'antiStealthMode', rating: 9, description: 'I frequently look at past code I\'ve written and shudder at where I was versus where I am now, and I look forward to where I\'ll be in the future; I\'m not one to assume I\'m the best, and if I start to believe I am, I seek a different environment.'},
	{type: 'literaryGenius', rating: 9, description: 'I take great pride in my communication skills, written or otherwise; I recognize the peril of communicating in text only and am happy to fire up a skype or google hangout when I want to confirm an understanding or just connect with a fellow team member.'},
	{type: 'chatBotV3.0', rating: 9, description: 'Chat has become a wonderful open-ended team communication tool - so long as I have the tools to limit the non-essential interruptions to my coding focus  ;-)'},
	{type: 'safeDriver', rating: 9, description: 'I like to stay in my lane when I\'m driving, never drifting into others\' lanes without first using my turn signal - I recognize that carelessly crossing the solid yellow line is just asking for needless conflicts - I also recognize that being challenged by others\' critical assessments in a code review, for instance, encourages me to grow.'},
	{type: '#lincoln-douglas', rating: 8, description: 'I enjoy making a case for what I believe to be the best course of action (framework choice, lunch choice - you name it); I enjoy learning why I\'m mistaken (which is far more common) even more :-D'},
	{type: 'whoops!', rating: 8, description: 'While no one relishes criticism (especially when so much effort and commitment has been made), a mature engineer recognizes the value of the feedback and incorporates it into future efforts to the benefit of the team and the product/project.'},
	{type: 'payItForward', rating: 9, description: 'I have found the most personal satisfaction in my career as a mentor for other developers; it is an awesome thing to contribute to the success of others, and I hope those opportunities continue to present themselves in the future.'},
	{type: 'iteration', rating: 10, description: 'I\'m perhaps addicted to never being satisfied - I\'ve been known to refactor refactoring code that was refactored ;-)'},
	{type: 'roadMap', rating: 8, description: 'While refactoring code can result in less code that is more elegant, it is of no use to a new developer that is unfamiliar with the campground - leaving concise comments and using lay-speak variables can make all the difference for the next dev to encounter the code section.'},
	{type: '#cleanRinseRepeat', rating: 9, description: 'I once sought to legally change my name to "Jon Refactoror Barrett" - code can always (it seems) be improved, reduced and eliminated (in the case of repitition)'},
	{type: 'soul', rating: 9, description: 'While I do LOVE being a full-stack software engineer, I don\'n permit my career to completely define me - other things make my heart pound and I seek balance in my life :-)'}
];

candidate.skills = [
	{type: '#UX', rating: 9, description: 'I\'m a HUGE believer in fantastic design and layout, clean interfaces and engaging responsiveness - I\'m also not a designer, so I don\'t have the best eye for these things - but I am EXCEPTIONAL at implementing the wireframes and features identified by the designers :-)'},
	{type: 'style', rating: 8, description: 'I\'m completely comfortable working within the inspector to arrive at the proper css for a given look, and I can translate those css adjustments into css code - HOWEVER, I\'m not especially experienced with mixins and other advanced css tricks; additionally, I\'ved worked in frameworks where the css preprocessors were already configured as part of the pipeline - I guess what I\'m saying is that I\'m not a css expert :-('},
	{type: 'js', rating: 9, description: 'My baby! I love working with javascript and I\'ve really found a home in MEAN stacks where I\'m using js in the client, the server and the db (mongo). I\'m very familiar working in MVC frameworks (tons of experience in Angular, for instance) and really want to add React to my skillset next - this seems like potentially the ideal opportunity for me to do that!'},
	{type: 'node', rating: 9, description: 'Here\'s my setup: I use nvm to install different versions of Node (depending on the project - "use nvm v.?"), "npm -g" to bring in the packages for the project and then start looking at the middleware as a starting point for a new Node project - you might say I\'ve done this a time or two ;-)'},
	{type: 'git', rating: 9, description: 'I commit early. I commit often. What more can you ask of a dev using git? Oh, right! You can also ask them to update the .gitignore file, to clone a repo or to create a new repo from existing code - yeah, I can do all of that (and more)'},
	{type: '#infosec', rating: 7, description: 'I\'m always looking to learn how to write more secure code. This is a skill that NO ONE can acquire to satisfaction; the very definition of this cat-and-mouse game is that code can never be secure enough - but we still seek to improve security.'},
	{type: 'framework', rating: 9, description: 'Node being one of the options listed (and the framework I\'ve used the most the last few years) I believe I meet the expectation for this skill set with ease.'},
	{type: '*nix', rating: 9, description: 'I maintain several servers (virtual and otherwise) for personal and professional use; I don\'t have a flavor I prefer, but I tend to use CentOS the most. I can add a user to the wheel group with no passwd required in my sleep. I\'ve configured iptables a bazillion times. Managing packages is second nature. Docker, on the other hand, I\'ve only used once (clumsily, I might add); while I understand why we might choose to use a container, I\'ve personally never been especially motivated to do so.'},
];

console.log(candidate);
