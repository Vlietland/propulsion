/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Constanten voor de schermopbouw  (movestuf.h)  */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de constanten voor de schermopbouw              */	
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                 21 maart 1997                                */
/*=====================================================================*/

#if !defined( _screen_h_)
#define _screen_h_

const int        Xblokken        =  screenlengte / bloklengte;
const int        Yblokken        = (screenhoogte - Yoffset) / blokhoogte;

const int        offsetadres     = (screenlengte % bloklengte) / 2;

const int        Xscreenmidcoor  =  Xblokken / 2;
const int        Yscreenmidcoor  =  Yblokken / 2;

const int        Xscreenmidpos   =  screenlengte / 2;
const int        Yscreenmidpos   =  screenhoogte / 2;


#endif _screen_h_