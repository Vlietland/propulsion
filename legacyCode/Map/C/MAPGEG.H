/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Mapeditor info           (mapgeg.h)            */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de gegevens die horen bij de mapeditor	       */
/*   Hierin wordt het volgende bij gehouden			       */
/*								       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 24 februari 1997                             */
/*=====================================================================*/

#define		rood            4

enum    keuzes   {getblok,setblok,shiftup,shiftdown,shiftleft,shiftright,
		  shiftrowup,shiftrowdown,undo,quit,niksgekozen,blind};

const  int	linkerknop_in   =   1;
const  int	links_rechts    =   3;

const  int	Xaantalblokken  =  11;
const  int	Yaantalblokken  =   8;

// coordinaten absoluut tov het scherm

const  int	Xquit		=   1;
const  int	Yquit		=   1;

const  int	Ygetoffset	=  40;	// gebruikt voor getblocks en setblocks


// muiscoordinaten absoluut tov het scherm

const  int	Yshiftdown      = screenhoogte - 8;  		    // 200 - 5
const  int	Yshiftup        = Yoffset + 8;

const  int	Xshiftleft      =   8;
const  int	Xshiftright     = Xaantalblokken * bloklengte - 8;  // 11 * 26

const  int	Xshiftrow       = screenlengte - bloklengte;
const  int	Yshiftrowup     = Ygetoffset + 8;
const  int	Yshiftrowdown   = screenhoogte - 8;


// coordinaten relatief tov het de basisscreenadres

const  int	Xsam            = Xshiftrow;
const  int	Ysam            = 0;

// textcoordinaten relatief tov het scherm

const  int	Xmessage        =   1;
const  int	Ymessage        =   1;

const  int	Xmapcoor        =  22;
const  int	Ymapcoor        =   1;

const  int	Xmaprow         =  33;
const  int	Ymaprow         =   1;

// variabelen gebruikt voor het vullen van de blokken

const  int      fuelamount      = 200;
const  int      energyamount    = 199;


