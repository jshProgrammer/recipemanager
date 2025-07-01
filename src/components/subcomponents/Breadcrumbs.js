import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { staticRouteLabels } from './breadcrumbMap';
import "../../styles/Breadcrumbs.css";

export default function Breadcrumbs({ overrideNames = {} }) {
    const location = useLocation();

    const pathParts = location.pathname.split('/').filter(Boolean);

    const pathSegments = pathParts.map((part, idx) => {
        const fullPath = `/${pathParts.slice(0, idx + 1).join('/')}`;
        return { name: decodeURIComponent(part), path: fullPath };
    });

    const filteredPathSegments = pathSegments.filter((segment, idx, arr) => {
        if (segment.name === "collections" && idx > 0 && arr[idx - 1].name === "favorites") {
            return false;
        }
        return true;
    });

    if (pathSegments.length === 0) return null;

    return (
        <nav aria-label="breadcrumb" className="mt-3 mb-4">
            <ol className="breadcrumb">
                {filteredPathSegments.map((segment, idx) => {

                    const isLast = idx === pathSegments.length - 1;
                    const staticLabel = staticRouteLabels[segment.path];
                    const overrideLabel = overrideNames[segment.name];

                    let label = overrideLabel || staticLabel || segment.name;

                    if (!staticLabel && !overrideLabel) {
                        label = label.charAt(0).toUpperCase() + label.slice(1);
                    }

                    return (
                        <li
                            key={idx}
                            className={`breadcrumb-item ${isLast ? 'active' : ''}`}
                            aria-current={isLast ? 'page' : undefined}
                        >
                            {isLast ? (
                                label
                            ) : (
                                <Link
                                    to={segment.path === "/collections" ? "/ownRecipes" :
                                        segment.path === "/favorites/collections" ? "/favorites" :
                                            segment.path === "/recipes" ? "/" :
                                        segment.path}
                                    className="breadcrumb-link"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}