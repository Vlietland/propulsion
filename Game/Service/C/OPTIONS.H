/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Playgamemanager definitie     (playgame.h)     */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   In deze file staat de definitie van de klasse playgame	       */
/*   Deze klasse bestaat vooral uit het managen (in goede volgorde     */
/*   aflopen) van de basisklassen.                                     */
/*                                                                     */
/*                                                                     */
/*                                                                     */
/* DATUM:                  12 maart 1997                               */
/*=====================================================================*/

#if !defined( _options_h_)
#define _options_h_

class Optionsman
  {
   public:
     void    initsettings();
     void    changesettings();
     devices getcommandoptionstatus() {return (inputdevice);}
     devices getsoundoptionstatus()   {return (sounddevice);}

   private:
     devices inputdevice, sounddevice;

  };

#endif  _options_h_