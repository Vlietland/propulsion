/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Zorgt voor de bouwsteenfiles    (bouwstn.h)    */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staan de gegevens van de bouwsteen		       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 11 februari 1997                             */
/*=====================================================================*/

#define	       zwart            0
#define	       blauw            1
#define	       groen            2
#define	       cyan             3
#define	       rood             4
#define	       magenta          5
#define	       bruin            6
#define	       lichtgrijs       7
#define	       donkergrijs      8
#define	       lichtblauw       9
#define	       lichtgroen      10
#define	       lichtcyan       11
#define	       lichtrood       12
#define	       lichtmagenta    13
#define	       geel            14
#define	       wit             15

enum   keuzes   {getcolor,setcolor,forward,back,quit,undo,xmir,ymir,rotate,niksgekozen,blind};

const  int	linkerknop_in   =   1;
const  int	links_rechts    =   3;

const  int	Xback		= 180;
const  int	Yback		=  10;

const  int	Xforward	= 240;
const  int	Yforward	=  10;

const  int	Xquit		=  20;
const  int	Yquit		=  10;

const  int	Xundo		= 240;
const  int	Yundo		=  50;

const  int	Xxmir		= 240;
const  int	Yxmir		=  90;

const  int	Xymir		= 180;
const  int	Yymir		=  90;

const  int	Xrotate		= 240;
const  int	Yrotate		= 120;

const  int	Xknop		=  40;
const  int	Yknop		=  20;

const  int	Xnummer		=  15;
const  int      Ynummer		=   2;

const  int	Xfile		=  19;
const  int	Yfile		=   2;

// ------------grafisch
const  int	Xnulgroot	=  25;
const  int	Ynulgroot	=  40;

const  int	Xnulklein	= 150;
const  int	Ynulklein	=  40;

const  int	Xnulsam		= 150;
const  int	Ynulsam		=  95;

const  int	Xnulinit	=  10;
const  int	Ynulinit	= 150;


// ---------schermgegevens
//const int		skipblok	 = 0x435F;



