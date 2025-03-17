/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de shipcommandos    (map.h)            */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze file bevat de informatie die door het gehele programma       */
/*   gebruikt worden                                                   */
/*								       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#if !defined( _gamehead_h_)
#define _gamehead_h_

// mapblokkennummering
// hieronder staat de nummering van de map. Het is erg belangrijk dat deze
// met zorgvuldigheid behandeld wordt omdat het programma aan de hand
// van de nummering de acties in het spel bepaald
// bv een nummer x is een fueltank deze wordt gecontroleerd met checkshield
// position. Aan de hand van dit nummer wordt bepaald of er zich een fueltank in
// de buurt van het schip bevind

const unsigned char     mapballbegin	   =   0;
const unsigned char     mapballend	   =   mapballbegin + 3;

const unsigned char     holderbegin        =   mapballend + 1;
const unsigned char     holderend          =   holderbegin + 3;

const unsigned char     turretbegindown	   =   holderend + 1;
const unsigned char     turretenddown	   =   turretbegindown + 8;

const unsigned char     turretbeginleft    =   turretenddown + 1;
const unsigned char     turretendleft	   =   turretbeginleft + 8;

const unsigned char     turretbeginup      =   turretendleft + 1;
const unsigned char     turretendup	   =   turretbeginup + 8;

const unsigned char     turretbeginright   =   turretendup + 1;
const unsigned char     turretendright     =   turretbeginright + 8;

const unsigned char     turret2begin	   =   turretendright + 1;
const unsigned char     turret2end	   =   turret2begin + 3;

const unsigned char     citybegin	   =   turret2end + 1;
const unsigned char     cityend            =   citybegin + 3;

const unsigned char     fueltankfull	   =   cityend + 1;
const unsigned char     fueltankempty      =   fueltankfull + 1;

const unsigned char     energypodfull	   =   fueltankempty + 1;
const unsigned char     energypodempty     =   energypodfull + 1;

const unsigned char	buttonoutbegin     =   energypodempty + 1;
const unsigned char     buttonoutend	   =   buttonoutbegin + 3;

const unsigned char	buttoninbegin      =   buttonoutend + 1;
const unsigned char     buttoninend	   =   buttoninbegin + 3;

const unsigned char     reactorbegin	   =   buttoninend + 1;
const unsigned char     reactorend         =   reactorbegin + 3;

const unsigned char     star1begin	   =   reactorend + 1;
const unsigned char     star1end	   =   star1begin + 3;

const unsigned char     star2begin	   =   star1end + 1;
const unsigned char     star2end	   =   star2begin + 3;

const unsigned char     turretfuckedbegin  =   star2end + 1;
const unsigned char     turretfuckedend    =   turretfuckedbegin + 3;

const unsigned char     turret2fuckedbegin =   turretfuckedend + 1;
const unsigned char     turret2fuckedend   =   turret2fuckedbegin + 3;

const unsigned char     fueltankfucked     =   turret2fuckedend + 1;
const unsigned char     energypodfucked    =   fueltankfucked + 1;

const unsigned char     empty		   =   energypodfucked + 1;

const unsigned char     rockbegin	   =   empty + 1;
const unsigned char     rockend		   =   rockbegin + 13;

const unsigned char     laserredvert       =   rockend + 1;
const unsigned char     laserredhor        =   laserredvert + 1;

const unsigned char     laserbluevert      =   laserredhor + 1;
const unsigned char     laserbluehor       =   laserbluevert + 1;

const unsigned char	laserdown	   =   laserbluehor + 1;

const unsigned char	laserleft	   =   laserdown + 1;

const unsigned char	laserup		   =   laserleft + 1;

const unsigned char	laserright         =   laserup + 1;

const int       soorten            = 114;   // in build.mix

const int       rockdepth	   = 10;    // het level begint lager


const int 	maplengte 	   =  80;
const int 	maphoogte 	   = 100;

const int       bloklengte         =  26;
const int       blokhoogte         =  22;

const int       blokkogellengte    =  10;
const int       blokkogelhoogte    =   9;

const int       screenlengte       = 320;
const int       screenhoogte       = 200;

const int	Yoffset		   =  18; // offset tov de bovenkant van het scherm
const unsigned int      basisscreenadres = 0x0A000 + (Yoffset * screenlengte / 0x10);
                                          // let op, adres is een segment dus / 16h
enum   bool     {false,true};

struct intvec
	 {
	  int Sx,Sy;
	 };

struct vector
	 {
	  float X,Y;
	 };

struct bouwsteen
	 {
	  unsigned char	   blok[blokhoogte][bloklengte];
	 };          // wordt op disk als Y,X opgeslagen

struct kogelbouwsteen
	 {
	  unsigned char	   blok[blokkogelhoogte][blokkogellengte];
	 };          // wordt op disk als Y,X opgeslagen


struct mappiece
	 {
	  unsigned char	   soort;
      	  unsigned char    status; // screenupdaterequest
	  unsigned char    damage;
	  unsigned char    Xextra;
	  unsigned char    Yextra;
	  unsigned char    Zextra;
	 };

#endif  _gamehead_h_