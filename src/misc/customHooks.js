import { useCallback, useState, useEffect , useRef} from 'react';
import { database } from './firebase';

export const useModalState = (defaultValue = false) => {
    const [isOpen, setIsOpen] = useState(defaultValue);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return { isOpen, open, close };
};

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(
        () => window.matchMedia(query).matches
    );

    useEffect(() => {
        const queryList = window.matchMedia(query);
        setMatches(queryList.matches);

        const listener = evt => setMatches(evt.matches);

        queryList.addListener(listener);
        return () => queryList.removeListener(listener);
    }, [query]);

    return matches;
};

export const usePresence = (uid)=>{
    const [presence, setPresence] = useState(null)
    useEffect(()=>{
        database.ref(`/status/${uid}`).on('value' , snapshot =>{
            if(snapshot.exists()){
                setPresence(snapshot.val())
            }
        })

        return ()=>{
            database.ref(`/status/${uid}`).off()
        }
    }, [presence, uid])

    return presence
}


export const useHover = ()=> {
    const [value, setValue] = useState(false);
    const ref = useRef(null);
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        const node = ref.current;
        if (node) {
          node.addEventListener("mouseover", handleMouseOver);
          node.addEventListener("mouseout", handleMouseOut);
        }
        return () => {
            node.removeEventListener("mouseover", handleMouseOver);
            node.removeEventListener("mouseout", handleMouseOut);
          };
          
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [ref.current] );

    return [ref, value];
  }