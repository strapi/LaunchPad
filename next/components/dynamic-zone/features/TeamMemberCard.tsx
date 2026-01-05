import { motion } from 'framer-motion';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { TeamMember } from '@/types/types';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

interface TeamMemberCardProps {
    member: TeamMember;
    initialSize: number;
    hoverSize: number;
    index: number;
    className?: string;
}

export default function TeamMemberCard({
    member,
    initialSize,
    hoverSize,
    index,
    className,
}: TeamMemberCardProps) {
    const fullImageUrl = strapiImage(member.image?.url || '');
    
    // Alterner gauche/droite selon l'index
    const isEven = index % 2 === 0;
    const slideDirection = isEven ? -100 : 100;

    return (
        <>
            {/* VERSION MOBILE - Design minimal avec animation et grid */}
            <div className="sm:hidden w-full">
                <motion.div 
                    className={cn(
                        'flex items-center gap-4 p-4',
                        'bg-white dark:bg-gray-900 rounded-lg',
                        'border border-gray-200 dark:border-gray-800',
                        'cursor-pointer',
                        className
                    )}
                    initial={{ x: slideDirection, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Image circulaire */}
                    <motion.div 
                        className="flex-shrink-0 relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        whileTap={{ scale: 1.05 }}
                    >
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-cyan-500/20">
                            <img
                                src={fullImageUrl}
                                alt={member.image?.alternativeText || `${member.first_name} ${member.last_name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                        <Typography 
                            as="h3" 
                            className="text-base font-bold text-gray-900 dark:text-white truncate"
                        >
                            {member.first_name} {member.last_name}
                        </Typography>
                        <Typography 
                            as="p" 
                            className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5"
                        >
                            {member.poste?.heading}
                        </Typography>
                    </div>

                    {/* Indicateur */}
                    <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    </div>
                </motion.div>
            </div>

            {/* VERSION DESKTOP - Layout avec hover (original avec animation) */}
            <motion.div
                className={cn(
                    'hidden sm:block',
                    'relative overflow-hidden group',
                    'h-[400px] md:h-[460px] lg:h-[520px]',
                    className
                )}
                style={{
                    cursor: 'pointer',
                }}
                initial={{ width: initialSize }}
                whileHover={{ width: hoverSize }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                        src={fullImageUrl}
                        alt={member.image?.alternativeText || `${member.first_name} ${member.last_name}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-400"
                    />
                </div>

                {/* Overlay avec informations */}
                <div className={cn(
                    'absolute bottom-0 left-0 right-0',
                    'bg-gradient-to-t from-black/90 via-black/60 to-transparent',
                    'p-4 md:p-5 lg:p-6',
                    'opacity-0 translate-y-5',
                    'group-hover:opacity-100 group-hover:translate-y-0',
                    'transition-all duration-300'
                )}>
                    <div className="text-white border-l-10  border-l-cyan-300 pl-3">
                        <Typography 
                            as="small" 
                            className="text-sm mb-1 font-light"
                        >
                            {member.poste?.heading}
                        </Typography>
                        <Typography 
                            as="h3" 
                            className="text-lg md:text-xl font-bold leading-tight"
                        >
                            {member.first_name} {member.last_name}
                        </Typography>
                    </div>
                </div>

                {/* Bordure cyan au hover */}
                <div className={cn(
                    'absolute left-0 top-0 bottom-0',
                    'w-1',
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-300'
                )} />
            </motion.div>
        </>
    );
}