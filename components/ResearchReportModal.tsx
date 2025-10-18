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
                className="bg-stone-800 border border-stone-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-stone-700">
                    <h2 className="text-2xl font-bold text-amber-300">Informe de Investigación</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-700/80 transition-colors">
                        <CloseIcon className="w-6 h-6 text-stone-400" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto prose prose-invert prose-p:text-stone-300 prose-h3:text-amber-400 prose-ul:list-disc prose-li:text-stone-300">
                    <h3>Resumen General</h3>
                    <p>El libro “Y Dios Ha Hablado” explora la naturaleza de la revelación divina, desde la creación hasta la encarnación de Jesucristo, y culmina en la respuesta humana de fe y obediencia. Su enfoque es teológico, pedagógico y espiritual, diseñado para guiar al lector en una comprensión progresiva de cómo Dios se comunica con la humanidad.</p>
                    
                    <h3>Estructura del Contenido</h3>
                    <ul>
                        <li><strong>Prólogo: El Silencio que Precedió la Voz:</strong> Introduce el misterio de la revelación y la necesidad humana de escuchar a Dios.</li>
                        <li><strong>Parte I: Revelación a través de la Creación:</strong> El cosmos como testigo y la naturaleza como reflejo de los atributos de Dios.</li>
                        <li><strong>Parte II: La Antigua Alianza – Ley y Profecía:</strong> La Ley como expresión de justicia y los profetas como portadores de la Palabra.</li>
                        <li><strong>Parte III: La Nueva Alianza – El Verbo Encarnado:</strong> Jesús como la Palabra hecha carne y mediador del nuevo pacto.</li>
                        <li><strong>Parte IV: La Respuesta Humana:</strong> La fe y obediencia como respuesta activa y el Espíritu Santo como revelador continuo.</li>
                        <li><strong>Parte V: El Nombre y los Atributos de Dios:</strong> El significado espiritual de los nombres divinos y la voz de Dios en el presente.</li>
                         <li><strong>Epílogo: Y Dios Sigue Hablando:</strong> Testimonios personales y una invitación a vivir en respuesta constante.</li>
                    </ul>

                    <h3>Temas Clave</h3>
                    <ul>
                        <li>Revelación progresiva.</li>
                        <li>Unidad entre creación, ley, profecía y encarnación.</li>
                        <li>Jesús como centro de la comunicación divina.</li>
                        <li>La fe como respuesta activa y transformadora.</li>
                        <li>El poder del Nombre de Dios como refugio y guía.</li>
                    </ul>

                    <h3>Aplicaciones</h3>
                    <ul>
                        <li>Ideal para estudios bíblicos, formación espiritual, predicación y enseñanza.</li>
                        <li>Puede integrarse en liturgias, meditaciones visuales y series devocionales.</li>
                        <li>Ofrece recursos para reflexión personal y comunitaria.</li>
                    </ul>
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
