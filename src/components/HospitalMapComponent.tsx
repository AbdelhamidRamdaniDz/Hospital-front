'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect } from 'react';

interface Case {
  _id: string;
  name: string;
  condition: string;
  createdAt: string;
  location: {
    lat: number;
    lng: number;
  };
  paramedic: {
    fullName: string;
    phone: string;
  };
}

interface HospitalMapComponentProps {
  cases: Case[];
  center: [number, number];
}

export default function HospitalMapComponent({ cases, center }: HospitalMapComponentProps) {
    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (L.Icon.Default) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete L.Icon.Default.prototype._getIconUrl;
                
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                } as L.IconOptions); 

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (typeof L.Icon.Default.prototype._getIconUrl === 'undefined') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (L.Icon.Default.prototype as any)._getIconUrl = function () {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        return (this as any).options.iconUrl;
                    };
                }
            }
        }
    }, []); 

    return (
        <MapContainer center={center} zoom={10} className="h-[80vh] rounded shadow border">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {cases.map((c: Case) => ( 
                <Marker
                    key={c._id}
                    position={[c.location.lat, c.location.lng]}

                    icon={L.icon({
                        iconUrl: '/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                    })}
                >
                    <Popup>
                        <strong>{c.name}</strong> <br />
                        الحالة: {c.condition} <br />
                        المسعف: {c.paramedic.fullName} <br />
                        📞 {c.paramedic.phone} <br />
                        🕒 {new Date(c.createdAt).toLocaleString('ar-DZ')}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}