import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Shield, Cpu, Layers, CheckCircle2, 
  Binary, Info 
} from 'lucide-react';
import { computeCRC } from '../utils/algorithms';
import { useFeatureModal } from '../context/ModalContext';

export default function LayerAccordion() {
  const { openFeatureModal } = useFeatureModal();
  const [openSection, setOpenSection] = useState('crc');

  // Interactive CRC Demo State
  const [dataBits, setDataBits] = useState('11010011101100');
  const [generator, setGenerator] = useState('10011');

  const crcResult = computeCRC(dataBits, generator);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <section id="layer-stack" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-2">
          <Layers className="w-3 h-3 text-emerald-400" />
          <span>CROSS-LAYER INTEGRATION • L2 & L4</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Data Link & Transport <span className="text-emerald-400">Context</span>
        </h2>
        <p className="mt-1.5 text-slate-400 text-xs sm:text-sm leading-relaxed">
          How higher and lower network layers ensure reliable delivery and bit-level integrity.<br />
          <span className="text-emerald-400 font-mono text-[11px] inline-flex items-center gap-1 mt-1">
            <Info className="w-3 h-3" /> Click headers or sub-boxes to view simple concept popups.
          </span>
        </p>
      </div>

      {/* Clean Accordion List */}
      <div className="space-y-3 max-w-4xl mx-auto">

        {/* Item 1: TCP vs UDP */}
        <div className="cyber-panel rounded-xl overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900/30">
            <button
              onClick={() => toggleSection('tcpudp')}
              className="flex-1 flex items-center justify-between text-left hover:text-white transition-colors cursor-pointer mr-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Transport Layer: Process Communication (TCP vs. UDP)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Delivers data to specific programs via port numbers (IP:Port) with flow control.
                  </p>
                </div>
              </div>
              {openSection === 'tcpudp' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => openFeatureModal('tcp')}
              title="Explain Transport Layer"
              className="p-1 rounded text-slate-500 hover:text-sky-400"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {openSection === 'tcpudp' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-800 text-xs text-slate-300 space-y-3">
              <p className="text-slate-400 text-[11px] leading-relaxed">
                While the Network Layer delivers packets between machines, the Transport Layer identifies which application receives the data.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* TCP */}
                <button
                  onClick={() => openFeatureModal('tcp')}
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-left transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-sky-400 text-[11px] group-hover:text-sky-300">TCP (RFC 793)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">Click for popup</span>
                  </div>
                  <p className="leading-snug text-slate-300 text-[11px]">
                    Establishes a 3-way handshake (SYN-ACK) and guarantees zero data loss through packet sequence numbers.
                  </p>
                  <p className="leading-snug text-slate-400 text-[11px]">
                    Slows down transmission speed automatically when the network experiences packet congestion.
                  </p>
                </button>

                {/* UDP */}
                <button
                  onClick={() => openFeatureModal('udp')}
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition-colors cursor-pointer group space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-purple-400 text-[11px] group-hover:text-purple-300">UDP (RFC 768)</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">Click for popup</span>
                  </div>
                  <p className="leading-snug text-slate-300 text-[11px]">
                    Connectionless protocol with an 8-byte header, transmitting packets immediately without setup delays.
                  </p>
                  <p className="leading-snug text-slate-400 text-[11px]">
                    Does not retransmit lost packets, making it ideal for live video streaming, voice calls, and gaming.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Item 2: CRC Error Detection */}
        <div className="cyber-panel rounded-xl overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900/30">
            <button
              onClick={() => toggleSection('crc')}
              className="flex-1 flex items-center justify-between text-left hover:text-white transition-colors cursor-pointer mr-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Data Link Layer: Error Detection via CRC
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Appends a mathematical remainder to catch bit corruption before routing packets.
                  </p>
                </div>
              </div>
              {openSection === 'crc' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => openFeatureModal('crc')}
              title="Explain CRC"
              className="p-1 rounded text-slate-500 hover:text-emerald-400"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {openSection === 'crc' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-800 text-xs text-slate-300 space-y-3">
              <p className="leading-relaxed text-slate-400 text-[11px]">
                Physical cable interference can flip binary 0s and 1s. The Data Link layer computes a Frame Check Sequence (FCS) using binary polynomial division.
              </p>

              {/* Realistic CRC Tool */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5 font-mono">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => openFeatureModal('crc')}
                    className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                  >
                    <Binary className="w-3 h-3" />
                    HARDWARE CRC-32/CRC-4 DIVISION VALIDATOR
                    <Info className="w-2.5 h-2.5 text-slate-500" />
                  </button>
                  <span className="text-[9px] text-slate-500">Modulo-2 XOR</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[9px] text-slate-500 block mb-0.5 uppercase">Data Payload Bits:</label>
                    <input
                      type="text"
                      value={dataBits}
                      onChange={(e) => setDataBits(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-sky-400 px-2 py-1.5 rounded text-xs focus:outline-none"
                      placeholder="e.g. 11010011101100"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 block mb-0.5 uppercase">Generator Polynomial:</label>
                    <input
                      type="text"
                      value={generator}
                      onChange={(e) => setGenerator(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-purple-400 px-2 py-1.5 rounded text-xs focus:outline-none"
                      placeholder="e.g. 10011"
                    />
                  </div>
                </div>

                {crcResult.isValid ? (
                  <div className="space-y-2 pt-0.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900 p-2 rounded border border-slate-800 text-[10px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">AUGMENTED DATA:</span>
                        <span className="text-slate-300 break-all">{crcResult.augmentedData}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">FCS CHECKSUM:</span>
                        <span className="text-emerald-400 font-bold">{crcResult.fcs}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">TRANSMITTED FRAME:</span>
                        <span className="text-sky-300 break-all">{crcResult.transmittedCodeword}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 p-1.5 rounded bg-emerald-950/30 border border-emerald-900/60 text-emerald-300 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Receiver divides transmitted frame by generator. Remainder = 0000 confirms zero bit errors.</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-rose-950/60 text-rose-300 rounded text-[10px]">
                    {crcResult.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Item 3: OSI Encapsulation */}
        <div className="cyber-panel rounded-xl overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900/30">
            <button
              onClick={() => toggleSection('encapsulation')}
              className="flex-1 flex items-center justify-between text-left hover:text-white transition-colors cursor-pointer mr-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Packet Journey: Protocol Encapsulation Stack
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    How raw application data gets packaged with headers as it moves down the wire.
                  </p>
                </div>
              </div>
              {openSection === 'encapsulation' ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => openFeatureModal('encapsulation')}
              title="Explain Encapsulation"
              className="p-1 rounded text-slate-500 hover:text-purple-400"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {openSection === 'encapsulation' && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-800 text-xs text-slate-300 space-y-2.5">
              <p className="leading-relaxed text-slate-400 text-[11px]">
                Each layer wraps the payload with specialized metadata to perform its role:
              </p>

              <div className="space-y-1.5 font-mono text-[10px]">
                <button
                  onClick={() => openFeatureModal('encapsulation')}
                  className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 flex justify-between cursor-pointer"
                >
                  <span className="text-slate-300">L7 • Application Layer</span>
                  <span className="text-slate-400">PDU: <strong className="text-sky-300">Message</strong> (HTTP payload)</span>
                </button>
                <button
                  onClick={() => openFeatureModal('tcp')}
                  className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 flex justify-between cursor-pointer"
                >
                  <span className="text-slate-300">L4 • Transport Layer</span>
                  <span className="text-slate-400">PDU: <strong className="text-sky-300">Segment</strong> (+ Port Header)</span>
                </button>
                <button
                  onClick={() => openFeatureModal('unicast_routing')}
                  className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 flex justify-between cursor-pointer"
                >
                  <span className="text-sky-400 font-medium">L3 • Network Layer (Project Scope)</span>
                  <span className="text-white">PDU: <strong className="text-sky-300">Packet</strong> (+ IP Header)</span>
                </button>
                <button
                  onClick={() => openFeatureModal('crc')}
                  className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 flex justify-between cursor-pointer"
                >
                  <span className="text-slate-300">L2 • Data Link Layer</span>
                  <span className="text-slate-400">PDU: <strong className="text-emerald-300">Frame</strong> (+ MAC + CRC FCS)</span>
                </button>
                <button
                  onClick={() => openFeatureModal('encapsulation')}
                  className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 flex justify-between cursor-pointer"
                >
                  <span className="text-slate-300">L1 • Physical Layer</span>
                  <span className="text-slate-400">PDU: <strong className="text-slate-400">Bits</strong> (Voltages on wire)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
