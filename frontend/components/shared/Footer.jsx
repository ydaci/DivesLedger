// UI
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

const Footer = ({children}) => {
    return ( 
    <footer className="footer text-2xl font-bold text-gray-800 dark:text-white">
        Tous droits réservés &copy; <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
         <AccordionTrigger>Equipe DivesLedger : </AccordionTrigger>
            <AccordionContent>
                Yanis DACI <br/>
                Nicolas RACT <br/>
                Fadi LADHARI <br/>
                Hugo VALVERDE <br/>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
         <AccordionTrigger>FAQ : </AccordionTrigger>
            <AccordionContent>
                Question 1 <br/>
                Question 2  <br/>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
         <AccordionTrigger>A propos : </AccordionTrigger>
            <AccordionContent>
                Triangle Dive
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    </footer>
    )
}

export default Footer;