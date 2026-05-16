import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumbs Component
 * @param {Object} props
 * @param {Array} props.items - Array of objects { label: string, link: string (optional) }
 * @param {string} props.className - Optional extra classes
 */
const Breadcrumbs = ({ items, className = "" }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={`flex items-center gap-2 text-sm font-medium text-slate-400 ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {item.link && !isLast ? (
                            <Link 
                                to={item.link} 
                                className="hover:text-indigo-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-slate-900 font-bold" : ""}>
                                {item.label}
                            </span>
                        )}
                        
                        {!isLast && <ChevronRight className="w-4 h-4" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
