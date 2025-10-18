
import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './IconComponents';

interface ResearchReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ResearchReportModal: React.FC<ResearchReportModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                ref={modalRef}
                className="bg-stone-800 border border-stone-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-stone-700">
                    <h2 className="text-2xl font-bold text-amber-300">Informe de Investigación y Fundamento Espiritual</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-700/80 transition-colors">
                        <CloseIcon className="w-6 h-6 text-stone-400" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto prose prose-invert prose-p:text-stone-300 prose-h3:text-amber-400 prose-ul:list-disc prose-li:text-stone-300 prose-blockquote:border-amber-500 prose-blockquote:text-stone-300">
                    <h3 className="text-amber-300 italic">Nota del Autor</h3>
                    <blockquote>
                        <p>Este libro explica mi experiencia personal del encuentro íntimo con DIOS como el Padre, el entendimiento de su amor a través de su HIJO y lo que nos conecta a Él a través del ESPÍRITU SANTO. Yo solo soy el instrumento de su OBRA, ÉL ES MI GUÍA Y MI SENDERO.</p>
                        <p>SI ESTO ES PARA TU GRACIA PADRE, QUE SEAS TÚ EL QUE GUÍE ESTA OBRA Y NO YO Y MIS DESEOS.</p>
                        <p><strong>YO NO SOY, SOLO TÚ SEÑOR ERES TODO.</strong></p>
                        <p className="mt-4">Pero siempre a quien pongo por delante de mí, y sin Él no podría ser, es Quien nos ama. Y aun así, nos ama tanto.</p>
                        <p className="mt-4">Señor, guía mis caminos, no permitas que no sea a Ti a quien glorifique en cada palabra, cada verso, cada frase. Oh Padre, solo a Ti me rindo. Padre, sabes que no es mala mi intención; si bien no conozco mi destino, confío en Ti porque antes de concebirme, Tú me diseñaste.</p>
                        <cite className="block text-right not-italic mt-2">— Salmo 139:13</cite>
                        <p className="mt-4">Oh Dios mío, tan perfecta es tu obra que no te cansas de observarla. En mí tocaste la melodía más hermosa, vibro en la frecuencia de tu camino. Oh Padre, me has dado la vida desde el primer aliento, no permitas que falte a mi encomienda. Oh Padre, cada ser es perfecto y tus notas son la luz divina. Padre, no me niegues tu mirada, que sin Ti yo no puedo. Gracias por enseñarme tanto, oh Padre hermoso. Me has enseñado tu amor profundo. Te amo, Padre, porque CRISTO me ama.</p>
                        <p className="mt-4">Solo permite, oh Padre, que esta obra sea de tu agrado para gloria tuya. Oh majestad misericordiosa, aliento de vida y creador de lo finito e infinito, Tú que tienes todo, permite que llegue como regalo de tu misericordia. Permite que habite en sus corazones tu Hijo y que el Espíritu Santo reboce en fe en la humanidad.</p>
                        <p className="mt-4">Permite, oh Dios, que seas Tú y solo Tú mi pensamiento. Que se haga Tu voluntad en cada parte y no la mía. <strong>AMÉN</strong>.</p>
                    </blockquote>

                    <h3 className="text-amber-300">Pilares Bíblicos Fundamentales</h3>
                    <p>Para entender la inmensidad de Su amor y gloria, la obra se cimienta en estas verdades:</p>
                    <ul className="not-prose list-none p-0 my-4 space-y-3">
                        <li className="flex items-start"><strong className="text-amber-400 font-semibold w-36 flex-shrink-0">Juan 3:16</strong><span>– El corazón del amor incondicional de Dios.</span></li>
                        <li className="flex items-start"><strong className="text-amber-400 font-semibold w-36 flex-shrink-0">Apocalipsis 22:13</strong><span>– La soberanía y eternidad de Cristo, el Principio y el Fin.</span></li>
                        <li className="flex items-start"><strong className="text-amber-400 font-semibold w-36 flex-shrink-0">Juan 1:1</strong><span>– La divinidad y preexistencia de la Palabra que se hizo carne.</span></li>
                        <li className="flex items-start"><strong className="text-amber-400 font-semibold w-36 flex-shrink-0">2 Timoteo 3:16</strong><span>– La inspiración divina y utilidad de toda la Escritura.</span></li>
                        <li className="flex items-start"><strong className="text-amber-400 font-semibold w-36 flex-shrink-0">Salmo 119:105</strong><span>– La Palabra como guía infalible en el camino de la vida.</span></li>
                    </ul>

                    <h3 className="text-amber-300">Dedicatoria</h3>
                    <p>
                        Dedicado a mi familia, en especial a Santiago porque libró la batalla con la ayuda de mi Padre. A mi esposa Natali, mis hijos Gael y Fernanda. A mis padres Simón y Diana, Magali y mis hermanos. Con amor hacia mis semejantes, no me olvido de mi hermana Michelle. Y en especial para todos los que me rodean, amigos como Rene, Roberto, Marco, Colis, Toño, Juan Carlos y más, Nelly y otros.
                    </p>
                    
                    <hr className="border-stone-600 my-6"/>

                    <h3 className="text-amber-300">Oraciones y Declaraciones Fundamentales</h3>
                    <blockquote>
                      <p className="text-lg font-semibold text-center font-serif text-stone-200">יהוה יֵשׁוּעַ</p>
                      <p>Tú eres el principio y el fin, el Cordero que vence, el refugio eterno de tu pueblo. En Ti se unen los cielos y la tierra, y en tu cruz resplandece la gloria del Dios eterno. Amén.</p>
                    </blockquote>
                    <blockquote className="mt-4">
                      <p className="text-lg font-semibold text-center font-serif text-stone-200">ABBA PADRE, TU MORADA ES EL FIRMAMENTO</p>
                      <p>🌌 Tú que habitas en lo alto, pero caminas con los humildes. Tu grandeza no me aleja, me asombra. Tu morada es el firmamento, pero tu presencia se inclina hacia el corazón contrito.</p>
                      <p>🛤️ No permitas mis deseos, que sea tu voluntad la que guíe mi sendero. Mis impulsos son breves, tu voluntad es eterna. Haz que mi camino se trace por tu sabiduría, no por mi ansiedad.</p>
                      <p>📖 Que tu Palabra llene de gozo mi alma. No busco consuelo pasajero, sino alegría que brota de tu verdad. Haz que tu Palabra sea mi alimento, mi canto, mi descanso.</p>
                      <p>❤️ Oh Padre, ¡te amo! No por lo que haces, sino por quien eres. No por lo que siento, sino por lo que sé. Te amo, porque tú me amaste primero.</p>
                    </blockquote>
                     <blockquote className="mt-4">
                      <p className="text-lg font-semibold text-center font-serif text-stone-200">Dios sin mí sigue siendo DIOS, pero yo sin Dios nada</p>
                      <p>🕊️ Dios sin mí sigue siendo DIOS. Él es eterno, inmutable, autosuficiente. No depende de mi adoración, ni de mi reconocimiento. Su gloria no se reduce si me alejo, ni se amplifica si me acerco. Él es el “Yo Soy” —el que era, es y será. Su grandeza no necesita testigos, pero su amor los busca.</p>
                      <p>🧎 Yo sin Dios nada SOY. Sin Él, mi vida pierde dirección. Mi alma se desorienta, mi propósito se diluye. Separado de Él, no puedo hacer nada (Juan 15:5). No soy autosuficiente, ni eterno, ni pleno. Pero esa “nada” que soy… es amada por Dios.</p>
                    </blockquote>

                    <h3 className="text-amber-300">La Ley Divina: Los Diez Mandamientos (Éxodo 20)</h3>
                    <p className="text-stone-400 italic">La ley de Dios solo es una, para su honra y gracia. Obedeced hermanos, a la voz de Dios Padre, todo poderoso, acudan al llamado, que les hace a través de su palabra.</p>
                    <ul className="not-prose list-none p-0 my-4 space-y-2 font-serif">
                        <li><strong>1.</strong> <span className="text-stone-400">לא תהוܐ ܠܟ ܐܠܗܐ ܐܚܪܢܐ ܠܩܕܡܝ</span> – No tendrás dioses ajenos delante de mí.</li>
                        <li><strong>2.</strong> <span className="text-stone-400">לא ܬܥܒܕ ܠܟ ܦܬܟܐ</span> – No harás imagen ni te inclinarás ante ellas.</li>
                        <li><strong>3.</strong> <span className="text-stone-400">לא ܬܣܒ ܫܡܗ ܕܡܪܝܐ ܠܫܘܐ</span> – No tomarás el nombre de Dios en vano.</li>
                        <li><strong>4.</strong> <span className="text-stone-400">ܙܘܟܘܪ ܠܝܘܡܐ ܕܫܒܬܐ</span> – Acuérdate del día de reposo para santificarlo.</li>
                        <li><strong>5.</strong> <span className="text-stone-400">ܝܩܪ ܠܐܒܘܟ ܘܠܐܡܟ</span> – Honra a tu padre y a tu madre.</li>
                        <li><strong>6.</strong> <span className="text-stone-400">לא ܬܩܛܘܠ</span> – No matarás.</li>
                        <li><strong>7.</strong> <span className="text-stone-400">ܠܐ ܬܓܘܪ</span> – No cometerás adulterio.</li>
                        <li><strong>8.</strong> <span className="text-stone-400">ܠܐ ܬܓܢܘܒ</span> – No robarás.</li>
                        <li><strong>9.</strong> <span className="text-stone-400">לא ܬܣܗܕ ܣܗܕܘܬܐ ܕܫܘܩܪܐ</span> – No darás falso testimonio.</li>
                        <li><strong>10.</strong> <span className="text-stone-400">לא ܬܪܓܘܒ ܒܐܢܘܢ ܕܚܒܪܟ</span> – No codiciarás lo que es de tu prójimo.</li>
                    </ul>

                    <h3 className="text-amber-300">El Padre Nuestro (Arameo)</h3>
                     <ul className="not-prose list-none p-0 my-4 space-y-2 font-serif">
                        <li><strong>Abun d-bashmayya</strong> (Padre nuestro que estás en los cielos)</li>
                        <li><strong>Nethqadash shmak</strong> (Santificado sea tu nombre)</li>
                        <li><strong>Tethe malkuthakh</strong> (Venga a nosotros tu Reino)</li>
                        <li><strong>Nehwe sebyonakh</strong> (Hágase tu Voluntad)</li>
                        <li><strong>Aykano d-bashmayo off bar'o</strong> (En la tierra como en el Cielo)</li>
                        <li><strong>Hab lan lahmo dsoonconan yawmono</strong> (Danos hoy el pan de cada día)</li>
                        <li><strong>Wa-shbok lan hawbaynan</strong> (Perdona nuestras deudas/ofensas)</li>
                        <li><strong>Aykano d-afnin l-hayyabayn</strong> (Como también nosotros perdonamos a los que nos tienen deudas)</li>
                        <li><strong>Wa-lo ta-la-lanu l-nesyono</strong> (No nos dejes caer en la tentación)</li>
                        <li><strong>Ela tsallan men beesh</strong> (Líbranos del mal)</li>
                        <li><strong>Aloomin olmin Amin</strong> (Por los siglos de los siglos. Amén.)</li>
                    </ul>

                    <hr className="border-stone-600 my-6"/>

                    <h3>Resumen General</h3>
                    <p>El libro “Y Dios Ha Hablado” explora la naturaleza de la revelación divina, desde la creación hasta la encarnación de Jesucristo, y culmina en la respuesta humana de fe y obediencia. Su enfoque es teológico, pedagógico y espiritual, diseñado para guiar al lector en una comprensión progresiva de cómo Dios se comunica con la humanidad.</p>
                </main>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};