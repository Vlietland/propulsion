/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de shipcommandos    (commands.h)       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de header voor de class commands                */
/*   Hierin wordt het volgende bij gehouden			       */
/*								       */
/*   * firestatus                                                      */
/*   * rotatestatus                                                    */
/*   * shieldstatus                                                    */
/*   * thruststatus                                                    */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#if !defined( _commands_h_)
#define _commands_h_

#ifdef __cplusplus
    #define __CPPARGS ...
#else
    #define __CPPARGS
#endif

struct commands
         {
	  onoff  thrust;
	  onoff  fire;
	  onoff  shield;
	  state3 rotate;
	  onoff  escape;
         };

class Commandsman
{
 public:
  void    initshipcommands();
  void    updateshipcommands();
  void 	  restoreshipcommands();

  onoff  getshieldstatus() {return (shipcom.shield);}
  onoff  getfirestatus()   {return (shipcom.fire);}
  onoff  getthruststatus() {return (shipcom.thrust);}
  state3 getrotatestatus() {return (shipcom.rotate);}
  onoff  getescapestatus() {return (shipcom.escape);}

 private:
  commands  	shipcom,jammed;
};

#endif  _commands_h_