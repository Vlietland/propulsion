/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Enumerated definitie         (enum.h)          */
/* AUTEUR:              Resourcer                                      */
/* BESCHRIJVING:                                                       */
/*   In deze H-file staan alle enumerated variabelen		       */
/*   het gehele programma                                              */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  12 maart 1997                               */
/*=====================================================================*/

#if !defined( _enum_h_)
#define _enum_h_

// source shipball
enum onoff         {deactive, prepare, active};
enum state3        {off,  left, right, up, down};
enum shieldcapture {nop,  fueltankcapt, energypodcapt, ballcapt, ballbalanced};
// source shipkogelhit
enum kogelhit      {njet, shield, target, delkogel};

enum gamestatus    {busy,init,load,restart,save,options,highscores,
                    shipgone,nextlevel,gameover,quit};

enum devices       {none,soundblaster,keyboard,joystick,mouse};

#endif _enum_h_