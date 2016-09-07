# corral

Just a fun little project that aims to implement the basics of a CodePen-like site.  Plenty of room for further refinements:

* User account system 
** Including 'ownership' of corrals granting permanent edit/delete permissions
* Editing corrals not overwriting saved version until user actively saves it
* Ability to use LESS/SASS and ES6 in the editor that gets compiled when displayed
* Nicer creation/editing interface
* Make it nice to look at
* Refactor code to be more modular
* Security (though some of the stickier problems haven't even been solved by CodePen, afaict)


## To Run

* Clone this repo
* Run `npm install` in the project's folder
* Install MySQL
* Run the following commands from a MySQL command prompt: (insert commands at the end are optional test data)

```
CREATE DATABASE `corral`;

CREATE USER 'corral_user'@'localhost' IDENTIFIED BY 'bad_password';
GRANT ALL PRIVILEGES ON `corral`.* TO 'corral_user'@'localhost';

CREATE TABLE `Content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `html` text NOT NULL,
  `less` text NOT NULL,
  `css` text NOT NULL,
  `es6` text NOT NULL,
  `js` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `Content` (`id`, `html`, `less`, `css`, `es6`, `js`) VALUES
(1,	'<h1>Test1</h1>\r\n<h2>SubTest1</h2>',	'h1 { color: red; } i { color: green; }',	'h2 { color: red; }',	'console.log(\'test\');',	'console.log(\'hi!\');'),
(3,	'<h1>Test2</h1>\r\n<h2>SubTest2</h2>',	'',	'h2 { color: green; }',	'',	'console.log(\'hi!!!!!\');'),
(4,	'<h1>Test3</h1>\r\n<h2>SubTest3</h2>',	'',	'h2 { color: blue; }',	'',	'console.log(\'hello\');'),
(5,	'<h1> Test CodeMirror3</h1>',	'',	'h1 { color: gray; }',	'',	'console.log(\'testing3\');');
```
* Visit localhost:3000 in your browser