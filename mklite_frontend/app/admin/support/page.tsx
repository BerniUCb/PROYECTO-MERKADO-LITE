'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { 
  Search, Filter, Clock, AlertCircle, CheckCircle, BarChart2, 
  Send, Phone, Mail, User, MoreVertical, ChevronDown
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

// Services
import { SupportTicketService } from '../../services/support-ticket.service';
import { SupportMessageService } from '../../services/supportMessage.service';

// Modelos
import type SupportTicket from '../../models/supportTicket.model';
import type SupportMessage from '../../models/supportMessage.model';
import type { TicketStatus } from '../../models/supportTicket.model';

const SupportPage: React.FC = () => {
  // --- ESTADOS ---
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Estado para la carga al cambiar estado
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- CARGA INICIAL ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            setCurrentAdminId(parsed.id);
        } catch (e) { console.error("Error leyendo usuario", e); }
    } else {
        setCurrentAdminId(1); 
    }
    loadTickets();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await SupportTicketService.getAll();
      setTickets(data);
      if (data.length > 0 && !selectedTicket) {
        setSelectedTicket(data[0]);
      }
    } catch (error) {
      console.error("Error cargando tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  // NUEVO: Manejar cambio de estado
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    setUpdatingStatus(true);
    try {
        // Llamada al servicio update
        const updated = await SupportTicketService.update(selectedTicket.id, { status: newStatus });
        
        // Actualizar UI localmente
        const updatedTicket = { ...selectedTicket, status: newStatus };
        setSelectedTicket(updatedTicket);
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        
        // Opcional: Enviar mensaje de sistema automático
        // await SupportMessageService.create({ content: `El estado del ticket cambió a: ${getStatusLabel(newStatus)}`, ... });

    } catch (error) {
        console.error("Error actualizando estado:", error);
        alert("No se pudo actualizar el estado.");
    } finally {
        setUpdatingStatus(false);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedTicket || !currentAdminId) return;

    try {
      const payload: any = {
        content: replyText,
        ticket_id: selectedTicket.id,
        sender_id: currentAdminId
      };

      const savedMessage = await SupportMessageService.create(payload);
      
      const newMessageLocal: SupportMessage = {
        ...savedMessage,
        sender: savedMessage.sender || { id: currentAdminId, fullName: 'Yo (Admin)' } as any 
      };

      const updatedTicket = {
        ...selectedTicket,
        messages: [...(selectedTicket.messages || []), newMessageLocal]
      };

      setSelectedTicket(updatedTicket);
      setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
      setReplyText("");
      
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("No se pudo enviar el mensaje.");
    }
  };

  // --- CALCULOS ---
  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    total: tickets.length
  };

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filterStatus);

  // --- RENDER HELPERS ---
  const getStatusLabel = (s: string) => {
     switch(s) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En Proceso';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
      default: return s;
     }
  };

  const getStatusClass = (s: string) => {
    switch(s) {
     case 'open': return styles.statusPending;
     case 'in_progress': return styles.statusProgress;
     case 'resolved': return styles.statusResolved;
     case 'closed': return styles.statusDefault;
     default: return styles.statusDefault;
    }
 };

 // Helper para prioridad
 const getPriorityLabel = (p?: string) => {
    if (!p) return '';
    switch(p) {
        case 'urgent': return 'Urgente';
        case 'high': return 'Alta';
        case 'medium': return 'Media';
        default: return 'Baja';
    }
 };
 
 const getPriorityColor = (p?: string) => {
    if (!p) return '';
    switch(p) {
        case 'urgent': return styles.tagUrgent;
        case 'high': return styles.tagHigh;
        case 'medium': return styles.tagMedium;
        default: return styles.tagLow;
    }
 };


  return (
    <div className={styles.adminLayout}>
      {/*<AdminSidebar />*/}
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>Atención al Cliente</h1>
              <p className={styles.pageSubtitle}>Gestiona las consultas y solicitudes de tus clientes</p>
            </div>
        </header>

        <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.bgYellow}`}>
                <div className={styles.statHeader}><span>Pendientes</span> <Clock size={18}/></div>
                <div className={styles.statValue}>{stats.open}</div>
            </div>
            <div className={`${styles.statCard} ${styles.bgBlue}`}>
                <div className={styles.statHeader}><span>En Proceso</span> <AlertCircle size={18}/></div>
                <div className={styles.statValue}>{stats.inProgress}</div>
            </div>
            <div className={`${styles.statCard} ${styles.bgGreen}`}>
                <div className={styles.statHeader}><span>Resueltos</span> <CheckCircle size={18}/></div>
                <div className={styles.statValue}>{stats.resolved}</div>
            </div>
            <div className={`${styles.statCard} ${styles.bgGray}`}>
                <div className={styles.statHeader}><span>Total</span> <BarChart2 size={18}/></div>
                <div className={styles.statValue}>{stats.total}</div>
            </div>
        </div>

        <div className={styles.workspace}>
            
            {/* --- LISTA --- */}
            <div className={styles.ticketListPanel}>
                <div className={styles.filterBar}>
                    <div className={styles.filterDropdown}>
                         <span>{filterStatus === 'all' ? 'Todos los tickets' : getStatusLabel(filterStatus)}</span>
                         <Filter size={14} />
                    </div>
                </div>

                <div className={styles.ticketsContainer}>
                    {loading && <div style={{textAlign:'center', padding:20, color:'#999'}}>Cargando...</div>}
                    {!loading && filteredTickets.length === 0 && (
                        <div style={{textAlign:'center', padding:20, color:'#999'}}>No hay tickets.</div>
                    )}

                    {filteredTickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            className={`${styles.ticketCard} ${selectedTicket?.id === ticket.id ? styles.ticketActive : ''}`}
                            onClick={() => handleTicketClick(ticket)}
                        >
                            <div className={styles.ticketHeader}>
                                <span className={styles.ticketCode}>#{ticket.id}</span>
                                <span className={`${styles.priorityTag} ${getPriorityColor(ticket.priority as string)}`}>
                                    {getPriorityLabel(ticket.priority as string)}
                                </span>
                            </div>
                            <h4 className={styles.ticketSubject}>{ticket.subject}</h4>
                            <div className={styles.ticketFooter}>
                                <span className={styles.clientName}>
                                    {ticket.user?.fullName || 'Desconocido'} 
                                </span>
                                <span className={`${styles.statusBadge} ${getStatusClass(ticket.status)}`}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                            </div>
                            <span className={styles.ticketTime}>
                                {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- DETALLE --- */}
            <div className={styles.ticketDetailPanel}>
                {selectedTicket ? (
                    <>
                        <div className={styles.detailHeader}>
                            <div style={{flex: 1}}>
                                <h2 className={styles.detailSubject}>
                                    {selectedTicket.subject} 
                                    {/* <span className={`${styles.priorityTag} ${getPriorityColor(selectedTicket.priority as string)}`} style={{marginLeft: 10, fontSize: '0.7rem', verticalAlign: 'middle'}}>
                                        {getPriorityLabel(selectedTicket.priority as string)}
                                    </span> */}
                                </h2>
                                <div className={styles.detailMeta}>
                                    Ticket #{selectedTicket.id} 
                                    {selectedTicket.order ? ` • Pedido #${selectedTicket.order.id}` : ''}
                                </div>
                            </div>
                            
                            {/* --- SELECTOR DE ESTADO --- */}
                            <div className={styles.statusSelectWrapper}>
                                <select 
                                    className={`${styles.statusSelect} ${getStatusClass(selectedTicket.status)}`}
                                    value={selectedTicket.status}
                                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                                    disabled={updatingStatus}
                                >
                                    <option value="open">Abierto</option>
                                    <option value="in_progress">En Proceso</option>
                                    <option value="resolved">Resuelto</option>
                                    <option value="closed">Cerrado</option>
                                </select>
                                <ChevronDown size={14} className={styles.selectIcon}/>
                            </div>

                        </div>

                        <div className={styles.clientInfoCard}>
                            <div className={styles.clientInfoItem}>
                                <div className={styles.iconCircle}><User size={16} /></div>
                                <div>
                                    <span className={styles.labelSmall}>Cliente</span>
                                    <div className={styles.valueSmall}>{selectedTicket.user?.fullName}</div>
                                </div>
                            </div>
                            <div className={styles.clientInfoItem}>
                                <div className={styles.iconCircle}><Mail size={16} /></div>
                                <div>
                                    <span className={styles.labelSmall}>Email</span>
                                    <div className={styles.valueSmall}>{selectedTicket.user?.email}</div>
                                </div>
                            </div>
                            <div className={styles.clientInfoItem}>
                                <div className={styles.iconCircle}><Phone size={16} /></div>
                                <div>
                                    <span className={styles.labelSmall}>Teléfono</span>
                                    <div className={styles.valueSmall}>{selectedTicket.user?.phone || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.chatArea}>
                            {selectedTicket.messages?.map((msg) => {
                                const isMe = msg.sender?.id === currentAdminId;
                                
                                return (
                                    <div key={msg.id} className={`${styles.messageBubble} ${isMe ? styles.msgAdmin : styles.msgClient}`}>
                                        <div className={styles.msgHeader}>
                                            <span style={{fontWeight: 600, fontSize: '0.75rem'}}>
                                                {isMe ? 'Tú' : msg.sender?.fullName}
                                            </span>
                                            <span className={styles.msgDate}>
                                                {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className={styles.msgContent}>{msg.content}</div>
                                    </div>
                                );
                            })}
                            
                            {(!selectedTicket.messages || selectedTicket.messages.length === 0) && (
                                <div className={styles.emptyChat}>No hay mensajes en este ticket aún.</div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <textarea 
                                className={styles.replyInput} 
                                placeholder="Escribe tu respuesta..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className={styles.inputActions}>
                                <button className={styles.sendBtn} onClick={handleSendMessage}>
                                    <Send size={14} style={{marginRight: 6}} /> Enviar Respuesta
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>Selecciona un ticket para ver los detalles</div>
                )}
            </div>

        </div>
      </main>
    </div>
  );
};

export default SupportPage;